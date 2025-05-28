import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function POST() {
  try {
    const response = NextResponse.json({ message: 'Выход выполнен успешно' }, { status: 200 });

    response.headers.append(
      'Set-Cookie',
      serialize('accessToken', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        expires: new Date(0), 
        path: '/',
      })
    );

    response.headers.append(
      'Set-Cookie',
      serialize('refreshToken', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        expires: new Date(0), 
        path: '/',
      })
    );
    return response;

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Внутренняя ошибка сервера при выходе' }, { status: 500 });
  }
}