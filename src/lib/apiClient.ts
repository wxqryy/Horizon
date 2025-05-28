"use client";

import { useAuth } from 'wxqryy/components/AuthProvider'; 

interface FailedRequest {
  resolve: (value: Response | PromiseLike<Response>) => void;
  reject: (reason?: unknown) => void;
  config: RequestInit; 
  url: string;
}

let isRefreshing = false;
let failedQueue: Array<FailedRequest> = [];

const processQueue = (error: unknown | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {

      if (token && prom.config.headers) { 

        let headersObj: Record<string, string> = {};
        if (prom.config.headers instanceof Headers) {
          prom.config.headers.forEach((value, key) => {
            headersObj[key] = value;
          });
        } else if (Array.isArray(prom.config.headers)) {
          prom.config.headers.forEach(([key, value]) => {
            headersObj[key] = value;
          });
        } else {
          headersObj = { ...prom.config.headers as Record<string, string> };
        }
        headersObj['Authorization'] = `Bearer ${token}`;
        prom.config.headers = headersObj;
      }

      fetch(prom.url, prom.config)
        .then(prom.resolve)
        .catch(prom.reject);
    }
  });
  failedQueue = [];
};

export const useApiClient = () => {

  const { accessToken, attemptTokenRefresh } = useAuth();

  const customFetch = async (url: string, config: RequestInit = {}): Promise<Response> => {
    const requestHeaders: Record<string, string> = {};

    if (config.headers) {
      if (config.headers instanceof Headers) {
        config.headers.forEach((value, key) => {
          requestHeaders[key] = value;
        });
      } else if (Array.isArray(config.headers)) { 
        config.headers.forEach(([key, value]) => {
          requestHeaders[key] = value;
        });
      } else { 

        Object.assign(requestHeaders, config.headers as Record<string, string>);
      }
    }

    if (accessToken) {
      requestHeaders['Authorization'] = `Bearer ${accessToken}`;
    }

    if (!requestHeaders['Content-Type'] && !(config.body instanceof FormData)) {
      requestHeaders['Content-Type'] = 'application/json';
    }

    const originalConfig: RequestInit = { ...config, headers: requestHeaders };

    try {
      const response = await fetch(url, originalConfig);

      if (!response.ok && response.status === 401) {
        console.log('[ApiClient] Received 401, attempting token refresh.');

        if (!isRefreshing) {
          isRefreshing = true;
          try {
            const newAccessToken = await attemptTokenRefresh();
            if (newAccessToken) {
              console.log('[ApiClient] Token refreshed, processing queue.');

              processQueue(null, newAccessToken); 

              const refreshedHeaders = { ...requestHeaders }; 
              refreshedHeaders['Authorization'] = `Bearer ${newAccessToken}`;

              return fetch(url, { ...config, headers: refreshedHeaders });
            } else {
              console.log('[ApiClient] Token refresh failed, newAccessToken is null.');
              const sessionExpiredError = new Error('Session expired. Please log in again.');
              processQueue(sessionExpiredError, null); 
              return Promise.reject(sessionExpiredError);
            }
          } catch (refreshError: unknown) { 
            console.error('[ApiClient] Catch block after attemptTokenRefresh:', refreshError);
            processQueue(refreshError, null); 
            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        } else {

          console.log('[ApiClient] Refreshing in progress, queuing request.');
          return new Promise<Response>((resolve, reject) => {

            failedQueue.push({ resolve, reject, config: originalConfig, url });
          });
        }
      }
      return response; 
    } catch (error: unknown) { 
      console.error('[ApiClient] Network or other fetch error:', error);

      if (error instanceof Error) {
        throw error;
      }

      throw new Error('An unexpected network error occurred.');
    }
  };

  return { apiClient: customFetch };
};