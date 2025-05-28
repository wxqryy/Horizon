import { NextRequest, NextResponse } from 'next/server';
import { getDb } from 'wxqryy/lib/db'; 
import { generateSecureToken, sendPasswordResetEmail } from 'wxqryy/lib/email'; 

const RESET_TOKEN_EXPIRY_MINUTES = 15;

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== 'string' || !/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json({ message: 'Пожалуйста, введите действительный email.' }, { status: 400 });
    }

    const db = await getDb();
    const user = await db.get(
      'SELECT id, email, password_reset_token, password_reset_token_sent_at FROM users WHERE email = ? AND is_verified = TRUE', 
      email.toLowerCase()
    );

    if (!user) {
      return NextResponse.json({ message: 'Если аккаунт с таким email существует и подтвержден, на него будет отправлено письмо с инструкциями по сбросу пароля.' }, { status: 200 });
    }

    if (user.password_reset_token && user.password_reset_token_sent_at) {
      const tokenSentAt = new Date(user.password_reset_token_sent_at);
      const tokenExpiryTime = new Date(tokenSentAt.getTime() + RESET_TOKEN_EXPIRY_MINUTES * 60 * 1000);

      if (new Date() < tokenExpiryTime) {

        return NextResponse.json({ message: `Письмо для сброса пароля уже было отправлено на ${email}. Пожалуйста, проверьте вашу почту (включая папку "Спам"). Вы сможете запросить новую ссылку через ${RESET_TOKEN_EXPIRY_MINUTES} минут после предыдущего запроса.` }, { status: 429 }); 
      }
    }

    const resetToken = generateSecureToken();
    const tokenSentAt = new Date();

    await db.run(
      'UPDATE users SET password_reset_token = ?, password_reset_token_sent_at = ? WHERE id = ?',
      [resetToken, tokenSentAt.toISOString(), user.id]
    );

    const emailResult = await sendPasswordResetEmail(user.email, resetToken);

    if (!emailResult.success) {
      return NextResponse.json({ message: 'Не удалось отправить письмо для сброса пароля. Пожалуйста, попробуйте позже или свяжитесь с поддержкой.' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Если аккаунт с таким email существует и подтвержден, на него будет отправлено письмо с инструкциями по сбросу пароля.' }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Произошла внутренняя ошибка сервера.' }, { status: 500 });
  }
}