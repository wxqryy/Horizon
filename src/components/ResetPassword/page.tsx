'use client';
import { useState, FormEvent, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Unlock from '../../assets/unlock.png'; 
import { useAuth } from 'wxqryy/components/AuthProvider'; 
import succes from 'wxqryy/assets/succes.png';


function ResetPasswordContent() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated, isLoadingAuth } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [internalError, setInternalError] = useState('');
  const [isLoading, setIsLoadingState] = useState(false);
  const [isClientMounted, setIsClientMounted] = useState(false);

  useEffect(() => {
    if (!isLoadingAuth && isAuthenticated) {
      router.replace('/profile');
      return;
    }
    if (isLoadingAuth || isAuthenticated) {
        return;
    }
    setIsClientMounted(true);
    const tokenFromParams = params?.token as string | undefined;
    if (tokenFromParams && typeof tokenFromParams === 'string' && tokenFromParams.length > 0) {
      setToken(tokenFromParams);
      setInternalError('');
    } else {
      setInternalError('Токен для сброса пароля не найден в URL или недействителен.');
      setToken('');
    }
  }, [params, isAuthenticated, isLoadingAuth, router]);

   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token || token === '') {
      setError('Отсутствует или недействителен токен для сброса. Пожалуйста, запросите сброс пароля снова.');
      return;
    }
    setIsLoadingState(true);
    setMessage('');
    setError('');
    if (!password || !confirmPassword) {
      setError('Все поля обязательны для заполнения.');
      setIsLoadingState(false);
      return;
    }
    if (password !== confirmPassword) {
      setError('Пароли не совпадают.');
      setIsLoadingState(false);
      return;
    }
    
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || 'Произошла ошибка при сбросе пароля.');
      } else {
        setMessage(data.message || 'Пароль успешно изменен! Вы будете перенаправлены на страницу входа.');
        setPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      console.error('Reset password error:', err);
      setError('Не удалось связаться с сервером. Проверьте ваше интернет-соединение.');
    } finally {
      setIsLoadingState(false);
    }
  };

  if (isLoadingAuth) {
    return <div className="flex min-h-screen items-center justify-center" style={{backgroundColor: '#f4f4f6'}}><p>Проверка авторизации...</p></div>;
  }
  if (isAuthenticated) {
      return <div className="flex min-h-screen items-center justify-center" style={{backgroundColor: '#f4f4f6'}}><p>Переадресация...</p></div>;
  }
  if (!isClientMounted || token === null) {
    return <div className="flex min-h-screen items-center justify-center" style={{backgroundColor: '#f4f4f6'}}><p>Загрузка токена...</p></div>;
  }
  if (token === '') {
     return (
        <div className="flex min-h-screen items-center justify-center p-6" style={{ backgroundColor: '#f4f4f6' }}>
            <div className="w-full max-w-xl text-center bg-white p-8 sm:p-10 rounded-xl shadow-lg"> {}
                <h2 className="text-2xl sm:text-3xl font-bold text-red-600 mb-4">Ошибка</h2>
                <p className="text-gray-700 text-lg">{internalError}</p>
                <Link href="/request-password-reset" className="mt-8 inline-block rounded-lg bg-indigo-600 px-6 py-3 text-base font-medium text-white hover:bg-indigo-700">
                    Запросить сброс пароля снова
                </Link>
            </div>
        </div>
    );
  }

  return (
    <div className="flex" style={{ backgroundColor: '#f4f4f6' }}> {}
      {message && !error ? (
        <>
      <div className="hidden lg:flex flex-1 items-center justify-center p-6 lg:p-10 xl:p-20">
        <Image src={succes} alt="Success" className="w-3/5 xl:w-4/5 h-auto max-w-md xl:max-w-lg" />
      </div>
      </>) : (
        <>
<div className="hidden lg:flex flex-1 items-center justify-center p-6 lg:p-10 xl:p-20">
        <Image src={Unlock} alt="Unlock" className="w-3/5 xl:w-4/5 h-auto max-w-md xl:max-w-lg" />
      </div>
      </>)}


      <div className="flex flex-1 items-center justify-center p-6 md:p-10 lg:p-16">
        <div className="w-full max-w-2xl xl:max-w-4xl bg-white p-8 sm:p-10 md:p-12 lg:p-16 rounded-2xl">
          {message && !error ? (
            <div className="text-center ">
              <h2 className="text-3xl sm:text-4xl md:text-[35px] font-bold font-['Unbounded'] text-gray-900 mb-10 sm:mb-12 text-left">Новый пароль создан</h2>
              <p className="text-gray-700 text-lg sm:text-xl mb-8">{message}</p>
              <Link href="/login" className="inline-block rounded-2xl bg-[#2C2C2C] px-6 py-3.5 text-base sm:text-lg font-medium text-white hover:bg-indigo-700">
                Перейти на страницу входа
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-3xl sm:text-4xl md:text-[35px] font-bold font-['Unbounded'] text-gray-900 mb-10 sm:mb-12 text-left">
                Создайте новый<br />пароль
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8"> {}
                <div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Придумайте пароль"

                    className="block w-full appearance-none rounded-xl border border-gray-300 px-5 py-4 sm:px-6 sm:py-5 placeholder-gray-500 text-base sm:text-lg shadow-sm focus:border-gray-700 focus:outline-none focus:ring-gray-700"
                    style={{ backgroundColor: '#F9FAFB', borderColor: '#E5E7EB' }} 
                  />
                </div>
                <div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Повторите пароль"

                    className="block w-full appearance-none rounded-xl border border-gray-300 px-5 py-4 sm:px-6 sm:py-5 placeholder-gray-500 text-base sm:text-lg shadow-sm focus:border-gray-700 focus:outline-none focus:ring-gray-700"
                    style={{ backgroundColor: '#F9FAFB', borderColor: '#E5E7EB' }} 
                  />
                </div>

                {error && <p className="text-base text-red-600">{error}</p>}

                <div>
                  <button
                    type="submit"
                    disabled={isLoading || !token}

                    className="flex w-full justify-center rounded-xl border border-transparent py-4 sm:py-5 px-4 text-base sm:text-lg font-semibold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60"
                    style={{ backgroundColor: '#2D3748' ,  }} 
                  >
                    {isLoading ? 'Сохранение...' : 'Подтвердить'}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center" style={{backgroundColor: '#f4f4f6'}}>
                <p className="text-lg">Загрузка...</p>
            </div>
        }>
            <ResetPasswordContent />
        </Suspense>
    );
}