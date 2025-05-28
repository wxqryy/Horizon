'use client';

import { useState, FormEvent, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from 'wxqryy/components/AuthProvider'; 

export default function RequestPasswordResetPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { isAuthenticated, isLoadingAuth } = useAuth(); 

  useEffect(() => {
    if (!isLoadingAuth && isAuthenticated) {
      router.replace('/profile'); 
    }
  }, [isAuthenticated, isLoadingAuth, router]);

  useEffect(() => {

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'unset'; 
    };
  }, []); 

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setError('');

    if (!email) {
      setError('Пожалуйста, введите ваш email.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/request-password-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase() }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Произошла ошибка. Попробуйте снова.');
      } else {
        setMessage(data.message); 
        setEmail(''); 

        if (response.status === 200 && data.message.startsWith('Если аккаунт')) { 
             setTimeout(() => {
                router.push('/login?status=reset_requested'); 
            }, 3000); 
        }
      }
    } catch (err) {
      console.error(err);
      setError('Не удалось связаться с сервером. Проверьте ваше интернет-соединение.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingAuth) {

    return <div className="flex h-screen items-center justify-center" style={{backgroundColor: '#f4f4f6'}}><p>Загрузка...</p></div>;
  }

  if (isAuthenticated) {
      return <div className="flex h-screen items-center justify-center" style={{backgroundColor: '#f4f4f6'}}><p>Переадресация...</p></div>;
  }

  return (

    <div className="flex h-screen" style={{ backgroundColor: '#f4f4f6' }}>
      <div className="flex flex-1 items-center justify-center p-6 lg:p-10">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 text-left">
            Забыли пароль?
          </h2>
          <p className="text-gray-600 mb-8 text-left">
            Введите ваш email адрес, связанный с аккаунтом, и мы отправим вам ссылку для сброса пароля.
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ваш email"
                className="block w-full appearance-none rounded-lg border border-gray-300 px-4 py-3.5 placeholder-gray-500 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
                style={{ backgroundColor: '#FFFFFF', borderColor: '#E0E0E0' }}
              />
            </div>

            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            {message && <p className="mt-2 text-sm text-green-700">{message}</p>}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full justify-center rounded-lg border border-transparent py-3.5 px-4 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-70"
                style={{ backgroundColor: '#333333' }} 
              >
                {isLoading ? 'Отправка...' : 'Отправить ссылку'}
              </button>
            </div>
          </form>
          <p className="mt-8 text-center text-sm text-gray-600">
            Вспомнили пароль?{' '}
            <Link href="/login" className="font-medium text-black hover:underline">
              Войти
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}