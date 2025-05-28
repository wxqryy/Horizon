import 'server-only';
import { cookies } from 'next/headers';
import { verifyRefreshToken} from './auth';

export async function getCurrentUserId(): Promise<number | null> {
  console.log('[auth-utils] getCurrentUserId (using refreshToken) called on server.');
  const cookieStore = await cookies();
  const refreshTokenCookie = cookieStore.get('refreshToken');

  if (!refreshTokenCookie || !refreshTokenCookie.value) {
    console.log('[auth-utils] refreshToken cookie NOT FOUND or has no value.');
    return null;
  }

  const token = refreshTokenCookie.value;
  const { payload, error } = await verifyRefreshToken(token);

  if (error) {
    console.error('[auth-utils] Error verifying refresh token:', error);
    return null;
  }

  if (payload && typeof payload.userId === 'number') {
    console.log('[auth-utils] Refresh Token verified successfully. UserId:', payload.userId);
    return payload.userId;
  }

  console.log('[auth-utils] Refresh Token verified, but payload is missing userId or userId is not a number.');
  return null;
}