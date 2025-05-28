import 'server-only';

import nodemailer from 'nodemailer';
import crypto from 'crypto';

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587', 10);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SENDER_EMAIL = process.env.SENDER_EMAIL || 'noreply@yourapp.com';
const APP_BASE_URL = process.env.APP_BASE_URL || 'http://localhost:3000';

export function generateSixDigitCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function generateSecureToken(length = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

async function sendEmail(to: string, subject: string, htmlContent: string, textContent?: string) {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.warn(
      `SMTP not configured. Email to ${to} with subject "${subject}" not sent. \nHTML: ${htmlContent}`
    );
    return { success: false, message: 'SMTP not configured' };
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    connectionTimeout: 60000,
    socketTimeout: 60000,
  });

  try {
    await transporter.sendMail({
      from: `"Horizon" <${SENDER_EMAIL}>`,
      to,
      subject,
      text: textContent || htmlContent.replace(/<[^>]*>?/gm, ''),
      html: htmlContent,
    });
    console.log(`Email sent to ${to} with subject "${subject}"`);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, message: 'Failed to send email' };
  }
}

export async function sendVerificationEmail(toEmail: string, code: string) {
  const subject = 'Подтвердите ваш аккаунт';
  const htmlContent = `
    <p>Здравствуйте!</p>
    <p>Ваш код для подтверждения регистрации: <strong>${code}</strong></p>
    <p>Если вы не регистрировались, проигнорируйте это письмо.</p>
  `;
  return sendEmail(toEmail, subject, htmlContent);
}

export async function sendPasswordResetEmail(toEmail: string, resetToken: string) {
  const subject = 'Сброс пароля для вашего аккаунта';
  const resetLink = `${APP_BASE_URL}/reset-password/${resetToken}`;
  const htmlContent = `
    <p>Здравствуйте!</p>
    <p>Вы (или кто-то другой) запросили сброс пароля для вашего аккаунта.</p>
    <p>Если это были не вы, проигнорируйте это письмо.</p>
    <p>Для сброса пароля, пожалуйста, перейдите по ссылке (действительна 15 минут):</p>
    <p><a href="${resetLink}">${resetLink}</a></p>
  `;
  return sendEmail(toEmail, subject, htmlContent);
}