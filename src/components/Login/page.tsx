"use client";
import React, { useState, FormEvent } from 'react';
import styles from './Login.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; 
import { useAuth } from 'wxqryy/components/AuthProvider'; 
import lockImage from '../../assets/lock.png';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth(); 
  const router = useRouter(); 

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);
    console.log('[Login Page] Submit started. Email:', email);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const responseCloneForText = response.clone();
      const responseText = await responseCloneForText.text();
      console.log('[Login Page] Raw response text:', responseText);

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('[Login Page] Error parsing JSON response:', parseError);
        setError(`Ошибка ответа сервера: ${responseText.substring(0, 100)}...`);
        setIsLoading(false);
        return;
      }
      console.log('[Login Page] Parsed response data:', data);

      if (!response.ok) {
        const errorMessage = data?.message || `Ошибка сервера (статус ${response.status})`;
        setError(errorMessage);
        if (data?.needsVerification && data?.userEmail) {
          setTimeout(() => {
            router.push(`/verify-email?email=${encodeURIComponent(data.userEmail)}`);
          }, 1500);
        }
      } else {
        if (data?.accessToken) {

          login(data.accessToken); 

        } else {
          setError('Токен доступа не получен.');
        }
      }
    } catch (networkOrOtherError) {

      if (networkOrOtherError instanceof Error) {
          setError(`Ошибка сети: ${networkOrOtherError.message}.`);
      } else {
          setError('Произошла неизвестная ошибка сети.');
      }
    } finally {
      setIsLoading(false);
    }
  };

    return (
    <div className={styles.pageContainer}> {}
      <div className={styles.authContainer}> {}
        <div className={styles.imageSection}>
          <Image src={lockImage} alt="Lock representation" className={styles.characterImage} priority />
        </div>
        <div className={styles.formSection}>
          <div className={styles.formWrapper}>
            <h2>Войдите в аккаунт</h2> {}
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Почта"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.inputField}
                required
                disabled={isLoading}
              />
              <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.inputField}
                required
                disabled={isLoading}
              />
              {error && <p className={styles.errorText}>{error}</p>}
              <button type="submit" className={styles.submitButton} disabled={isLoading}>
                {isLoading ? 'Вход...' : 'Войти'}
              </button>
            </form>
            <p className={styles.loginLink}>
              Нет аккаунта?{' '}
              <Link href="/register">Регистрация</Link>
            </p>
                        <p className={styles.loginLink} style={{ marginTop: '15px' }}>
              <Link href="/request-password-reset">Забыли пароль?</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;