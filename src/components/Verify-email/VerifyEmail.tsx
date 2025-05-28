"use client";

import React, { useState, useEffect, useRef, KeyboardEvent, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import styles from './VerifyEmail.module.css'; 
import emailIcon from 'wxqryy/assets/pack.png'; 

const VerifyEmail: React.FC = () => { 
  const router = useRouter();
  const searchParams = useSearchParams(); 
  const [initialEmail, setInitialEmail] = useState('');
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendMessage, setResendMessage] = useState('');

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const emailFromUrl = searchParams.get('email');
    if (emailFromUrl) {
      setInitialEmail(decodeURIComponent(emailFromUrl));
    }

    setTimeout(() => inputRefs.current[0]?.focus(), 0);
  }, [searchParams]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    const value = element.value;
    if (isNaN(Number(value)) && value !== '') return; 

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); 
    setOtp(newOtp);

    if (value && index < otp.length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0 && inputRefs.current[index - 1]) {

      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    const verificationCode = otp.join('');
    if (!initialEmail || verificationCode.length !== 6) {
      setError('Пожалуйста, введите email и полный 6-значный код подтверждения.');
      setIsLoading(false);
      return;
    }
    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: initialEmail, verificationCode }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Ошибка подтверждения.');
        setOtp(new Array(6).fill(''));
        inputRefs.current[0]?.focus();
      } else {
        setSuccessMessage(data.message || 'Аккаунт успешно подтвержден!');
        setTimeout(() => router.push('/login'), 2000);
      }
    } catch (err) {
      console.error("Verify email submit error:", err);
      setError('Произошла ошибка сети. Попробуйте еще раз.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0 || !initialEmail || isLoading) return;
    setIsLoading(true);
    setError('');
    setSuccessMessage('');
    setResendMessage('');
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: initialEmail }),
      });
      const data = await response.json();
      if (!response.ok) {
        setResendMessage(data.message || 'Ошибка повторной отправки.');

        if (response.status === 429 && data.message && data.message.includes('Пожалуйста, подождите')) {
            const match = data.message.match(/(\d+)\s*сек/);
            if (match && match[1]) {
                setResendCooldown(parseInt(match[1], 10));
            } else {
                setResendCooldown(60); 
            }
        }
      } else {
        setResendMessage(data.message || 'Новый код отправлен.');
        setOtp(new Array(6).fill(''));
        inputRefs.current[0]?.focus();
        setResendCooldown(60); 
      }
    } catch (err) {
      console.error("Resend code error:", err);
      setResendMessage('Ошибка сети при повторной отправке.');
    } finally {
      setIsLoading(false);
    }
  };

  const maskEmail = (emailToMask: string) => {
    if (!emailToMask) return "вашу почту";
    const [name, domain] = emailToMask.split('@');
    if (!name || !domain) return emailToMask; 
    return `${name.substring(0, Math.min(3, name.length))}****@${domain}`;
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.verificationCard}>
        <div className={styles.iconSection}>
          <Image src={emailIcon} alt="Email Verification" width={500} height={500} priority />
        </div>
        <div className={styles.contentSection}>
          <h2>Подтверждение аккаунта</h2>
          <p className={styles.instructionText}>
            На e-mail <span className={styles.emailHighlight}>{maskEmail(initialEmail)}</span> было отправлено письмо с кодом подтверждения
          </p>

          <form onSubmit={handleSubmit} className={styles.otpForm}>
            <div className={styles.otpInputContainer}>
              {otp.map((data, index) => (
                <input
                  key={index}
                  type="text" 
                  pattern="[0-9]*" 
                  inputMode="numeric" 
                  name={`otp-${index}`} 
                  className={styles.otpInput}
                  value={data}
                  onChange={(e) => handleChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onFocus={(e) => e.target.select()}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  maxLength={1}
                  disabled={isLoading}
                  autoComplete="one-time-code" 
                  aria-label={`Цифра кода ${index + 1}`}
                />
              ))}
            </div>

            {error && <p className={`${styles.messageText} ${styles.errorText}`}>{error}</p>}
            {successMessage && <p className={`${styles.messageText} ${styles.successText}`}>{successMessage}</p>}

            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading || otp.join('').length !== 6}
            >
              {isLoading ? 'Проверка...' : 'Подтвердить'}
            </button>
          </form>

          <div className={styles.resendSection}>
            <span className={styles.resendInfoText}>Не пришло письмо?</span>
            <button
              onClick={handleResendCode}
              disabled={resendCooldown > 0 || isLoading || !initialEmail}
              className={styles.resendButton}
              type="button" 
            >
              {resendCooldown > 0 ? `Отправить еще раз (${resendCooldown}с)` : 'Отправить еще раз'}
            </button>
            {resendMessage && (
              <p
                className={`${styles.messageText} ${styles.resendMessageFeedback} ${
                  resendMessage.toLowerCase().includes('ошибка') || resendMessage.toLowerCase().includes('пожалуйста, подождите')
                  ? styles.errorText
                  : styles.successText 
                }`}
              >
                {resendMessage}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;