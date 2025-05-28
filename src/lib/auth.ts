import 'server-only';

import bcrypt from 'bcrypt';
import jwt, { SignOptions, JwtPayload as OfficialJwtPayload, TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';

const SALT_ROUNDS = 10;

const JWT_ACCESS_SECRET_KEY = process.env.JWT_SECRET;
const JWT_ACCESS_TOKEN_EXPIRES_IN_SECONDS_ENV = process.env.JWT_ACCESS_TOKEN_EXPIRES_IN_SECONDS;

const JWT_REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET_KEY;
const JWT_REFRESH_TOKEN_EXPIRES_IN_SECONDS_ENV = process.env.JWT_REFRESH_TOKEN_EXPIRES_IN_SECONDS;

if (!JWT_ACCESS_SECRET_KEY) {
  const errorMessage = 'FATAL ERROR: JWT_SECRET (for Access Token) is not defined. Set it in your environment variables.';
  console.error(errorMessage);
  throw new Error(errorMessage);
}

if (!JWT_REFRESH_SECRET_KEY) {
  const errorMessage = 'FATAL ERROR: JWT_REFRESH_SECRET_KEY is not defined. Set it in your environment variables.';
  console.error(errorMessage);
  throw new Error(errorMessage);
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export interface AccessTokenPayload extends OfficialJwtPayload {
  userId: number;
  email: string;
  username: string;
}

export interface RefreshTokenPayload extends OfficialJwtPayload {
  userId: number;
}

function parseExpiresInSeconds(envVar: string | undefined, defaultValue: number, tokenName: string): number {
  let expiresInSeconds: number = defaultValue;
  if (envVar) {
    const parsed = parseInt(envVar, 10);
    if (!isNaN(parsed) && parsed > 0) {
      expiresInSeconds = parsed;
    } else {
      console.warn(
        `Warning: ${tokenName}_EXPIRES_IN_SECONDS ("${envVar}") ` +
        `is not a valid positive number. Defaulting to ${defaultValue} seconds.`
      );
    }
  }
  return expiresInSeconds;
}

export function generateAccessToken(payload: { userId: number; email: string; username: string }): string {
  const tokenOptions: SignOptions = {
    expiresIn: parseExpiresInSeconds(JWT_ACCESS_TOKEN_EXPIRES_IN_SECONDS_ENV, 900, 'JWT_ACCESS_TOKEN') 
  };

  const tokenCustomPayload: Omit<AccessTokenPayload, keyof OfficialJwtPayload> = {
    userId: payload.userId,
    email: payload.email,
    username: payload.username,
  };

  return jwt.sign(tokenCustomPayload, JWT_ACCESS_SECRET_KEY!, tokenOptions);
}

export function verifyAccessToken(token: string): { payload: AccessTokenPayload | null; error?: 'token_expired' | 'invalid_token' | 'verification_failed' } {
  try {

    const decoded = jwt.verify(token, JWT_ACCESS_SECRET_KEY!) as AccessTokenPayload;
    return { payload: decoded };
  } catch (err: unknown) { 
    if (err instanceof TokenExpiredError) { 
      return { payload: null, error: 'token_expired' };
    }
    if (err instanceof JsonWebTokenError) { 
      console.error('Invalid Access Token:', err.message);
      return { payload: null, error: 'invalid_token' };
    }

    console.error('Access Token verification failed with an unexpected error:', err);
    return { payload: null, error: 'verification_failed' };
  }
}

export function generateRefreshToken(payload: { userId: number }): string {
  const tokenOptions: SignOptions = {
    expiresIn: parseExpiresInSeconds(JWT_REFRESH_TOKEN_EXPIRES_IN_SECONDS_ENV, 604800, 'JWT_REFRESH_TOKEN') 
  };

  const tokenCustomPayload: Omit<RefreshTokenPayload, keyof OfficialJwtPayload> = {
    userId: payload.userId,
  };

  return jwt.sign(tokenCustomPayload, JWT_REFRESH_SECRET_KEY!, tokenOptions);
}

export function verifyRefreshToken(token: string): { payload: RefreshTokenPayload | null; error?: 'token_expired' | 'invalid_token' | 'verification_failed' } {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET_KEY!) as RefreshTokenPayload;
    return { payload: decoded };
  } catch (err: unknown) { 
    if (err instanceof TokenExpiredError) { 
      return { payload: null, error: 'token_expired' };
    }
    if (err instanceof JsonWebTokenError) { 
      console.error('Invalid Refresh Token:', err.message);
      return { payload: null, error: 'invalid_token' };
    }
    console.error('Refresh Token verification failed with an unexpected error:', err);
    return { payload: null, error: 'verification_failed' };
  }
}