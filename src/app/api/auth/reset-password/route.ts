import { NextRequest, NextResponse } from 'next/server';
import { getDb } from 'wxqryy/lib/db'; 
import { hashPassword } from 'wxqryy/lib/auth'; 

const RESET_TOKEN_EXPIRY_MINUTES = 15; 

export async function POST(req: NextRequest) {
  try {
    const { token, newPassword } = await req.json();

    if (!token || typeof token !== 'string') {
      return NextResponse.json({ message: 'Токен для сброса пароля не предоставлен или некорректен.' }, { status: 400 });
    }
    if (!newPassword || typeof newPassword !== 'string') {
      return NextResponse.json({ message: 'Новый пароль не предоставлен.' }, { status: 400 });
    }

    

    const db = await getDb();
    const user = await db.get('SELECT id, password_reset_token_sent_at FROM users WHERE password_reset_token = ?', token);

    if (!user || !user.password_reset_token_sent_at) {
      return NextResponse.json({ message: 'Недействительный или уже использованный токен сброса пароля.' }, { status: 400 });
    }

    const tokenSentAt = new Date(user.password_reset_token_sent_at);
    const expiryTime = new Date(tokenSentAt.getTime() + RESET_TOKEN_EXPIRY_MINUTES * 60 * 1000);

    if (new Date() > expiryTime) {

      await db.run('UPDATE users SET password_reset_token = NULL, password_reset_token_sent_at = NULL WHERE id = ?', user.id);
      return NextResponse.json({ message: 'Срок действия токена сброса пароля истек. Пожалуйста, запросите сброс пароля снова.' }, { status: 400 });
    }

    const hashedPassword = await hashPassword(newPassword);

    await db.run(
      'UPDATE users SET password_hash = ?, password_reset_token = NULL, password_reset_token_sent_at = NULL WHERE id = ?',
      [hashedPassword, user.id]
    );

    return NextResponse.json({ message: 'Пароль успешно изменен. Теперь вы можете войти с новым паролем.' }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Произошла внутренняя ошибка сервера при смене пароля.' }, { status: 500 });
  }
}