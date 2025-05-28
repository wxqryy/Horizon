"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useRef,
} from 'react';
import { usePathname, useRouter } from 'next/navigation';

export interface DecodedToken {
  userId: number;
  username: string;
  email: string;
  exp: number; 
  iat: number; 
  avatarUrl?: string;
}

export interface UserContextData {
  userId: number;
  username: string;
  email: string;
  avatarUrl?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserContextData | null; 
  accessToken: string | null;

  login: (newAccessToken: string) => void;
  logout: () => Promise<void>;
  isLoadingAuth: boolean; 
  attemptTokenRefresh: () => Promise<string | null>; 
  updateUserContextData: (dataToUpdate: Partial<UserContextData>) => void; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function decodeJwtToken(token: string): DecodedToken | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) {
      console.warn("[AuthProvider] Invalid token: missing payload part.");
      return null;
    }
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const decoded = JSON.parse(jsonPayload);

    if (
      decoded &&
      typeof decoded.exp === 'number' &&
      typeof decoded.iat === 'number' && 
      typeof decoded.userId === 'number' &&
      typeof decoded.username === 'string' &&
      typeof decoded.email === 'string'
    ) {
      return decoded as DecodedToken;
    }
    console.warn("[AuthProvider] Decoded token is missing required fields or has incorrect types.", decoded);
    return null;
  } catch (e) {
    console.error("[AuthProvider] Error decoding or parsing token:", e);
    return null;
  }
}

const AUTH_PAGES = new Set(['/login', '/register']);

const PUBLIC_STATIC_PATHS = new Set([
  '/',
  '/request-password-reset',
]);

const VERIFY_EMAIL_PATH_PREFIX = '/verify-email';
const RESET_PASSWORD_TOKEN_PATH_PREFIX = '/reset-password';

export const AuthProvider = ({ children }: { children: ReactNode }) => {

  const [user, setUser] = useState<UserContextData | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true); 
  const [isRedirecting, setIsRedirecting] = useState(false); 
  const router = useRouter();
  const pathname = usePathname();
  const previousPathnameRef = useRef<string | null>(pathname); 

  const handleNewAccessToken = useCallback((newAccessToken: string | null) => {
    if (newAccessToken) {
      const decodedToken = decodeJwtToken(newAccessToken);
      if (decodedToken && decodedToken.exp * 1000 > Date.now()) {
        localStorage.setItem('accessToken', newAccessToken);
        setAccessToken(newAccessToken);

        const userData: UserContextData = {
          userId: decodedToken.userId,
          username: decodedToken.username,
          email: decodedToken.email,
          avatarUrl: decodedToken.avatarUrl,
        };
        setUser(userData);
        console.log('[AuthProvider] AccessToken set and user updated:', userData.username);
        return true; 
      } else {
        if (decodedToken) {
          console.log('[AuthProvider] Received token is expired or invalid.');
        } else {
          console.log('[AuthProvider] Failed to decode received token.');
        }
      }
    }

    localStorage.removeItem('accessToken');
    setAccessToken(null);
    setUser(null);
    console.log('[AuthProvider] AccessToken cleared or invalid.');
    return false; 
  }, []); 

  const updateUserContextData = useCallback((dataToUpdate: Partial<UserContextData>) => {
    setUser(currentUser => {
      if (!currentUser) {
        console.warn("[AuthProvider] updateUserContextData called but no current user.");
        return null;
      }
      const updatedUser = { ...currentUser, ...dataToUpdate };
      console.log('[AuthProvider] User data updated in context:', updatedUser);

      return updatedUser;
    });
  }, []); 

  useEffect(() => {
    console.log('[AuthProvider] Initializing auth state...');
    setIsLoadingAuth(true);
    const tokenFromStorage = localStorage.getItem('accessToken');
    handleNewAccessToken(tokenFromStorage);
    setIsLoadingAuth(false); 

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'accessToken') {
        console.log('[AuthProvider] accessToken changed in another tab/window. Re-validating.');
        setIsLoadingAuth(true);
        setIsRedirecting(false); 
        handleNewAccessToken(event.newValue);
        setIsLoadingAuth(false);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [handleNewAccessToken]);

  useEffect(() => {
    if (previousPathnameRef.current !== pathname) {
      console.log(`[AuthProvider] Pathname changed from "${previousPathnameRef.current}" to "${pathname}". Resetting isRedirecting flag.`);
      setIsRedirecting(false);
      previousPathnameRef.current = pathname;
    }
  }, [pathname]);

  useEffect(() => {
    console.log(
      `[AuthProvider DEBUG] Redirect Check. Path: ${pathname}, Token: ${!!accessToken}, Loading: ${isLoadingAuth}, Redirecting: ${isRedirecting}`
    );

    if (isLoadingAuth || isRedirecting) {
      console.log(`[AuthProvider DEBUG] Skipping redirect: Loading=${isLoadingAuth}, Redirecting=${isRedirecting}`);
      return;
    }

    const isAuthPage = AUTH_PAGES.has(pathname);
    const isStaticPublicPage = PUBLIC_STATIC_PATHS.has(pathname);
    const isVerifyEmailPage = pathname.startsWith(VERIFY_EMAIL_PATH_PREFIX);
    const isResetPasswordTokenPage = pathname.startsWith(RESET_PASSWORD_TOKEN_PATH_PREFIX);

    const isConsideredPublic =
      isAuthPage ||
      isStaticPublicPage ||
      isVerifyEmailPage ||
      isResetPasswordTokenPage;

    const isProtectedRoute = !isConsideredPublic;

    console.log(`[AuthProvider DEBUG] Path: "${pathname}" evaluation:`);
    console.log(`  isAuthPage: ${isAuthPage}, isStaticPublicPage: ${isStaticPublicPage}, isVerifyEmailPage: ${isVerifyEmailPage}, isResetPasswordTokenPage: ${isResetPasswordTokenPage}`);
    console.log(`  isConsideredPublic: ${isConsideredPublic}, isProtectedRoute: ${isProtectedRoute}`);

    if (accessToken && isAuthPage) {
      console.log(`[AuthProvider DEBUG] User authenticated on auth page. Redirecting to /profile.`);
      setIsRedirecting(true);
      router.replace('/profile');
    } else if (!accessToken && isProtectedRoute) {
      console.log(`[AuthProvider DEBUG] User not authenticated on protected route. Redirecting to /login.`);
      setIsRedirecting(true);
      router.replace('/login');
    } else {
      console.log(`[AuthProvider DEBUG] No redirect condition met for path "${pathname}".`);
    }
  }, [accessToken, pathname, isLoadingAuth, router, isRedirecting]); 

  const login = useCallback(
    (newAccessToken: string) => {
      console.log('[AuthProvider] login function called.');
      const loginSuccessful = handleNewAccessToken(newAccessToken);
      if (loginSuccessful) {

        setIsRedirecting(false);
      }
    },
    [handleNewAccessToken] 
  );

  const logout = useCallback(async () => {
    console.log('[AuthProvider] logout function called. Clearing client and server session.');
    const pathBeforeLogout = pathname; 

    try {

      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('[AuthProvider] Error during server logout API call:', error);
    }

    handleNewAccessToken(null); 

    if (pathBeforeLogout !== '/') {
      console.log(`[AuthProvider] Logout: current path "${pathBeforeLogout}", replacing to /.`);
      setIsRedirecting(true); 
      router.replace('/');
    } else {

      console.log(`[AuthProvider] Logout: current path is already "/". Token cleared.`);
      setIsRedirecting(false);
    }
  }, [handleNewAccessToken, router, pathname]);

  const attemptTokenRefresh = useCallback(async (): Promise<string | null> => {
    console.log('[AuthProvider] Attempting to refresh AccessToken...');
    setIsLoadingAuth(true);

    try {
      const response = await fetch('/api/auth/refresh', { method: 'GET' });
      if (response.ok) {
        const data = await response.json();
        const newAccessToken = data.accessToken as string | undefined;
        if (newAccessToken) {
          console.log('[AuthProvider] AccessToken refreshed successfully.');
          handleNewAccessToken(newAccessToken);
          setIsRedirecting(false); 
          return newAccessToken;
        }
        console.error('[AuthProvider] Refresh API responded OK but no accessToken in body. Logging out.');
        handleNewAccessToken(null); 

        return null;
      }
      console.log(`[AuthProvider] Failed to refresh AccessToken (status: ${response.status}). Logging out.`);
      handleNewAccessToken(null); 

      return null;
    } catch (error) {
      console.error('[AuthProvider] Network or other error during token refresh:', error);
      handleNewAccessToken(null); 

      return null;
    } finally {
      setIsLoadingAuth(false);
    }
  }, [handleNewAccessToken]); 

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!accessToken,
        user, 
        accessToken,
        login,
        logout,
        isLoadingAuth,
        attemptTokenRefresh,
        updateUserContextData, 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider. Make sure your component is wrapped by AuthProvider.');
  }
  return context;
};