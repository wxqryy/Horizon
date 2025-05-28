import { NextRequest, NextResponse } from 'next/server';
import { getDb } from 'wxqryy/lib/db';
import { hashPassword } from 'wxqryy/lib/auth';
import { isPasswordSecure } from 'wxqryy/lib/utils';
import { generateSixDigitCode, sendVerificationEmail } from 'wxqryy/lib/email';

export async function POST(req: NextRequest) {
  try {
    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json({ message: 'Все поля обязательны' }, { status: 400 });
    }
    if (username.length < 3) {
      return NextResponse.json({ message: 'Имя пользователя: мин. 3 символа' }, { status: 400 });
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json({ message: 'Некорректный email' }, { status: 400 });
    }
    if (!isPasswordSecure(password)) {
      return NextResponse.json({
        message: 'Пароль: мин. 8 симв., 1 заглавная, 1 спецсимвол.',
      }, { status: 400 });
    }

    const db = await getDb();
    const existingUser = await db.get('SELECT id FROM users WHERE email = ? OR username = ?', email, username);
    if (existingUser) {
      const field = (await db.get('SELECT id FROM users WHERE email = ?', email)) ? 'Email' : 'Имя пользователя';
      return NextResponse.json({ message: `${field} уже используется` }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const verificationCode = generateSixDigitCode();
    const now = new Date().toISOString();

    const result = await db.run(
      'INSERT INTO users (username, email, password_hash, is_verified, verification_code, verification_code_sent_at) VALUES (?, ?, ?, ?, ?, ?)',
      username,
      email,
      passwordHash,
      false,
      verificationCode,
      now
    );

    if (result.lastID) {
      await sendVerificationEmail(email, verificationCode);
      return NextResponse.json({ message: 'Регистрация успешна. Проверьте email для кода подтверждения.', userEmail: email }, { status: 201 });
    } else {
      return NextResponse.json({ message: 'Ошибка регистрации' }, { status: 500 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}