import { NextRequest, NextResponse } from 'next/server';
import { getDb } from 'wxqryy/lib/db';

const VERIFICATION_CODE_LIFETIME_MINUTES = 15;

export async function POST(req: NextRequest) {
  try {
    const { email, verificationCode } = await req.json();

    if (!email || !verificationCode) {
      return NextResponse.json({ message: 'Email и код подтверждения обязательны' }, { status: 400 });
    }

    const db = await getDb();
    const user = await db.get('SELECT * FROM users WHERE email = ?', email);

    if (!user) {
      return NextResponse.json({ message: 'Пользователь не найден' }, { status: 404 });
    }
    if (user.is_verified) {
      return NextResponse.json({ message: 'Аккаунт уже подтвержден' }, { status: 400 });
    }
    if (user.verification_code !== verificationCode) {
      return NextResponse.json({ message: 'Неверный код подтверждения' }, { status: 400 });
    }

    if (user.verification_code_sent_at) {
      const codeSentAt = new Date(user.verification_code_sent_at);
      const now = new Date();
      const diffMinutes = (now.getTime() - codeSentAt.getTime()) / (1000 * 60);
      if (diffMinutes > VERIFICATION_CODE_LIFETIME_MINUTES) {
        return NextResponse.json({ message: 'Код подтверждения истек. Запросите новый.' }, { status: 400 });
      }
    } else {
       return NextResponse.json({ message: 'Ошибка: время отправки кода не найдено.' }, { status: 500 });
    }

    await db.run(
      'UPDATE users SET is_verified = TRUE, verification_code = NULL, verification_code_sent_at = NULL WHERE id = ?',
      user.id
    );
    return NextResponse.json({ message: 'Аккаунт успешно подтвержден. Теперь вы можете войти.' }, { status: 200 });
  } catch (error) {
    console.error('Verify API error:', error);
    return NextResponse.json({ message: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}