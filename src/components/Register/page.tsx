"use client";
import React, { useState } from 'react';
import styles from './Register.module.css';
import characterImage from '../../assets/character.png'; 
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; 


const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(''); 
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    if (password !== confirmPassword) {
      setError('Пароли не совпадают!');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Ошибка регистрации. Попробуйте снова.');
      } else {
        setSuccessMessage(data.message || 'Регистрация прошла успешно! Теперь вы можете войти.');

        setUsername('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');

        setTimeout(() => {
            router.push(`/verify-email?email=${encodeURIComponent(data.userEmail)}`);
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      setError('Произошла ошибка сети. Пожалуйста, проверьте ваше подключение.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.registerContainer}>
      <div className={styles.imageSection}>
        <Image src={characterImage} alt="Character representation" className={styles.characterImage} />
      </div>
      <div className={styles.formSection}>
        <div className={styles.formWrapper}>
          <h2>Создайте аккаунт</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Имя пользователя"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={styles.inputField}
              required
              disabled={isLoading}
            />
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
              placeholder="Придумайте пароль"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(''); 
              }}
              className={styles.inputField}
              required
              disabled={isLoading}
            />
            <input
              type="password"
              placeholder="Повторите пароль"
              value={confirmPassword}
              onChange={(e) => {
                 setConfirmPassword(e.target.value);
                 if (error) setError(''); 
              }}
              className={styles.inputField}
              required
              disabled={isLoading}
            />
            {error && <p className={styles.errorText}>{error}</p>}
            {successMessage && <p className={styles.successText}>{successMessage}</p>} {}

            <button type="submit" className={styles.submitButton} disabled={isLoading}>
              {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>
          </form>
          <p className={styles.loginLink}>
            Уже есть аккаунт?{' '}
            <Link href="/login">
              Войти
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;