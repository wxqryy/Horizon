import { NextRequest, NextResponse } from 'next/server';
import { getDb } from 'wxqryy/lib/db'; 
import {
  comparePassword,
  generateAccessToken,
  generateRefreshToken
} from 'wxqryy/lib/auth'; 
import { serialize } from 'cookie';
import { generateSixDigitCode, sendVerificationEmail } from 'wxqryy/lib/email'; 

const RESEND_LOGIN_COOLDOWN_SECONDS = 60;

const REFRESH_TOKEN_MAX_AGE_SECONDS = parseInt(
  process.env.JWT_REFRESH_TOKEN_EXPIRES_IN_SECONDS || (7 * 24 * 60 * 60).toString(),
  10
);

interface UserFromDb {
  id: number;
  email: string;
  username: string;
  password_hash: string;
  is_verified: 0 | 1;
  verification_code_sent_at: string | null;
  created_at: string;
}

interface LoginRequestBody {
  email?: string;
  password?: string;
}

interface ErrorWithCode {
  code: string;
  message?: string; 

}

function isErrorWithCode(error: unknown): error is ErrorWithCode {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof (error as { code: unknown }).code === 'string'
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as LoginRequestBody;
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ message: 'Email и пароль обязательны' }, { status: 400 });
    }

    const db = await getDb();

    const user = await db.get<UserFromDb>(
      'SELECT id, email, username, password_hash, is_verified, verification_code_sent_at, created_at FROM users WHERE email = ?',
      email.toLowerCase()
    );

    if (!user) {
      return NextResponse.json({ message: 'Неверный email или пароль' }, { status: 401 });
    }

    const passwordMatch = await comparePassword(password, user.password_hash);
    if (!passwordMatch) {
      return NextResponse.json({ message: 'Неверный email или пароль' }, { status: 401 });
    }

    if (user.is_verified === 0) {
      const now = new Date();
      let canResendCodeNow = true;

      if (user.verification_code_sent_at) {
        const lastSent = new Date(user.verification_code_sent_at);
        const diffSeconds = (now.getTime() - lastSent.getTime()) / 1000;
        if (diffSeconds < RESEND_LOGIN_COOLDOWN_SECONDS) {
          canResendCodeNow = false;
        }
      }

      if (canResendCodeNow) {
        const newVerificationCode = generateSixDigitCode();
        await db.run(
          'UPDATE users SET verification_code = ?, verification_code_sent_at = ? WHERE id = ?',
          newVerificationCode,
          now.toISOString(),
          user.id
        );

        await sendVerificationEmail(user.email, newVerificationCode);
        return NextResponse.json({
          message: 'Аккаунт не подтвержден. Новый код подтверждения отправлен на ваш email.',
          needsVerification: true,
          userEmail: user.email,
        }, { status: 403 });
      } else {

        const lastSentTime = user.verification_code_sent_at ? new Date(user.verification_code_sent_at).getTime() : now.getTime();
        const timeLeft = Math.ceil(RESEND_LOGIN_COOLDOWN_SECONDS - ((now.getTime() - lastSentTime) / 1000));
        return NextResponse.json({
          message: `Аккаунт не подтвержден. Повторная отправка кода будет доступна через ${timeLeft} сек.`,
          needsVerification: true,
          userEmail: user.email,
        }, { status: 403 });
      }
    }

    const accessToken = generateAccessToken({ userId: user.id, email: user.email, username: user.username });
    const refreshToken = generateRefreshToken({ userId: user.id });

    const userResponseData = {
      id: user.id,
      email: user.email,
      username: user.username,
      isVerified: user.is_verified === 1,
      createdAt: user.created_at,
    };

    const response = NextResponse.json({
      message: 'Вход выполнен успешно',
      user: userResponseData,
      accessToken: accessToken,
    }, { status: 200 });

    response.headers.append(
      'Set-Cookie',
      serialize('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: REFRESH_TOKEN_MAX_AGE_SECONDS,
        path: '/',
      })
    );

    return response;

  } catch (error: unknown) { 
    console.error('Login API error:', error);

    if (isErrorWithCode(error) && error.code === 'SQLITE_ERROR') {

      console.error('SQLite Error details:', error.message || 'No additional message');
      return NextResponse.json({ message: 'Ошибка базы данных при попытке входа.' }, { status: 500 });
    }

    if (error instanceof Error) {
        console.error('JavaScript Error details:', error.message, error.stack);
    }
    return NextResponse.json({ message: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}