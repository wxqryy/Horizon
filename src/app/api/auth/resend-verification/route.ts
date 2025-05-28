import { NextRequest, NextResponse } from 'next/server';
import { getDb } from 'wxqryy/lib/db';
import { generateSixDigitCode, sendVerificationEmail } from 'wxqryy/lib/email';

const RESEND_COOLDOWN_SECONDS = 60;

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ message: 'Email обязателен' }, { status: 400 });
    }

    const db = await getDb();
    const user = await db.get('SELECT * FROM users WHERE email = ?', email);

    if (!user) {
      return NextResponse.json({ message: 'Пользователь не найден' }, { status: 404 });
    }
    if (user.is_verified) {
      return NextResponse.json({ message: 'Аккаунт уже подтвержден' }, { status: 400 });
    }

    const now = new Date();
    if (user.verification_code_sent_at) {
      const lastSent = new Date(user.verification_code_sent_at);
      const diffSeconds = (now.getTime() - lastSent.getTime()) / 1000;
      if (diffSeconds < RESEND_COOLDOWN_SECONDS) {
        const timeLeft = Math.ceil(RESEND_COOLDOWN_SECONDS - diffSeconds);
        return NextResponse.json({ message: `Пожалуйста, подождите ${timeLeft} сек. перед повторной отправкой.` }, { status: 429 });
      }
    }

    const newVerificationCode = generateSixDigitCode();
    await db.run(
      'UPDATE users SET verification_code = ?, verification_code_sent_at = ? WHERE id = ?',
      newVerificationCode,
      now.toISOString(),
      user.id
    );

    await sendVerificationEmail(email, newVerificationCode);
    return NextResponse.json({ message: 'Новый код подтверждения отправлен на ваш email.' }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}