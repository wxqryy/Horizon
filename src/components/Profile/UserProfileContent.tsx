"use client";
import React, { useState, useRef, ChangeEvent, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import styles from './UserProfileContent.module.css';
import type { UserProfilePageData } from 'wxqryy/lib/data'; 
import { useAuth } from 'wxqryy/components/AuthProvider'; 
import profileCup from 'wxqryy/assets/profile_cup.png'; 
import profileDocs from 'wxqryy/assets/profile_docs.png'; 
import profileStats from 'wxqryy/assets/profile_stats.png'; 
import profileMyPub from 'wxqryy/assets/profile_mypublic.png'; 
import profileSuccess from 'wxqryy/assets/profile_success.png'; 
import profileChar from 'wxqryy/assets/profile_char.png'; 

const ResumeIcon: React.FC<{ className?: string }> = ({ className }) => <Image src={profileDocs} alt="Резюме" className={className} width={32} height={32} />;
const AchievementsIcon: React.FC<{ className?: string }> = ({ className }) => <Image src={profileCup} alt="Достижения" className={className} width={32} height={32} />;
const AccountIcon: React.FC<{ className?: string }> = ({ className }) => <Image src={profileChar} alt="Аккаунт" className={className} width={32} height={32} />;
const PublicationsIcon: React.FC<{ className?: string }> = ({ className }) => <Image src={profileMyPub} alt="Публикации" className={className} width={32} height={32} />;
const ApplicationsIcon: React.FC<{ className?: string }> = ({ className }) => <Image src={profileSuccess} alt="Заявки" className={className} width={32} height={32} />;
const AnalyticsIcon: React.FC<{ className?: string }> = ({ className }) => <Image src={profileStats} alt="Аналитика" className={className} width={32} height={32} />;

const profileActions = [
  { id: 'resume', label: 'Резюме', iconComponent: ResumeIcon, href: "/profile/resume", iconColorClass: styles.iconColorResume },
  { id: 'achievements', label: 'Достижения', iconComponent: AchievementsIcon, href: "/profile/achievements", iconColorClass: styles.iconColorAchievements },
  { id: 'account', label: 'Аккаунт', iconComponent: AccountIcon, href: "/profile/account", iconColorClass: styles.iconColorAccount },
  { id: 'publications', label: 'Мои публикации', iconComponent: PublicationsIcon, href: "/profile/my-publications", iconColorClass: styles.iconColorPublications },
  { id: 'applications', label: 'Мои заявки', iconComponent: ApplicationsIcon, href: "/profile/applications", iconColorClass: styles.iconColorApplications },
  { id: 'analytics', label: 'Аналитика профиля', iconComponent: AnalyticsIcon, href: "/profile/analytics", iconColorClass: styles.iconColorAnalytics },
];

interface UserProfileContentProps {
  userData: UserProfilePageData | null;
}

const DEFAULT_AVATAR_URL = '/default-avatar.png'; 

const UserProfileContent: React.FC<UserProfileContentProps> = ({ userData: initialUserDataProp }) => {
  const [currentDisplayAvatar, setCurrentDisplayAvatar] = useState<string>(DEFAULT_AVATAR_URL);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarUploadMessage, setAvatarUploadMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const { accessToken, user: authUserContext, updateUserContextData } = useAuth();

  useEffect(() => {
    let newUrl = DEFAULT_AVATAR_URL;
    if (initialUserDataProp?.avatarUrl) {
      newUrl = initialUserDataProp.avatarUrl;
    } else if (authUserContext?.avatarUrl) {
      newUrl = authUserContext.avatarUrl;
    }
    if (newUrl !== currentDisplayAvatar) {
      setCurrentDisplayAvatar(newUrl);
    }
  }, [initialUserDataProp, authUserContext, currentDisplayAvatar]);

  useEffect(() => {
    let timerId: NodeJS.Timeout | null = null;
    if (avatarUploadMessage) {
      timerId = setTimeout(() => {
        setAvatarUploadMessage(null);
      }, 5000);
    }
    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [avatarUploadMessage]);

  const handleAvatarContainerClick = () => {
    if (isUploadingAvatar) return;
    fileInputRef.current?.click();
  };

  const handleFileSelected = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (fileInputRef.current) fileInputRef.current.value = ""; 
    if (!file) return;

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      setAvatarUploadMessage({ type: 'error', text: 'Неверный тип файла. Разрешены: JPG, PNG.' });
      return;
    }
    const maxSizeMB = 10;
    if (file.size > maxSizeMB * 1024 * 1024) {
      setAvatarUploadMessage({ type: 'error', text: `Файл слишком большой (максимум ${maxSizeMB}MB).` });
      return;
    }

    setIsUploadingAvatar(true);
    setAvatarUploadMessage(null);
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const response = await fetch('/api/user/avatar', {
        method: 'POST',
        headers: { ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {}) },
        body: formData,
      });

      let result: { success?: boolean; message?: string; avatarUrl?: string };
      try {
        result = await response.json();
      } catch (errorParsingJson: unknown) { 
        console.warn(
            `[UserProfileContent] Не удалось разобрать ответ сервера как JSON. Статус: ${response.status}.`,
            errorParsingJson 
        );
        if (!response.ok) {

            throw new Error(`Ошибка сервера: ${response.status} ${response.statusText}. Ответ не в формате JSON.`);
        }

        result = { success: false, message: 'Некорректный формат ответа от сервера (ожидался JSON).' };
      }

      if (!response.ok) {

        throw new Error(result?.message || `Ошибка загрузки: ${response.status} ${response.statusText}`);
      }

      if (result?.success && result?.avatarUrl) {
        setAvatarUploadMessage({ type: 'success', text: result.message || 'Аватар успешно обновлен!' });
        setCurrentDisplayAvatar(result.avatarUrl);

        if (updateUserContextData) {
          updateUserContextData({ avatarUrl: result.avatarUrl });
        }

        console.log("[UserProfileContent handleFileSelected] Вызов router.refresh()...");
        router.refresh(); 
      } else {

        throw new Error(result?.message || 'Не удалось обновить аватар. Сервер вернул некорректные данные.');
      }
    } catch (error: unknown) { 
      let errorMessage = 'Произошла неизвестная ошибка при загрузке аватара.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.error("Ошибка загрузки аватара:", error);
      setAvatarUploadMessage({ type: 'error', text: errorMessage });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  if (!initialUserDataProp) {
    return (
      <main className={styles.mainContent}>
        <div className={styles.contentCard} style={{ textAlign: 'center', padding: '20px' }}>
          <p>Загрузка данных профиля...</p>
        </div>
      </main>
    );
  }

  const { name, progress } = initialUserDataProp;
  const mainProgressPercent = progress.total > 0
    ? (progress.completed / progress.total) * 100 : 0;
  const nextStepNumber = progress.completed + 1;
  const isProfileComplete = progress.completed >= progress.total;

  return (
    <main className={styles.mainContent}>
      <section className={styles.contentCard}>
        <div className={styles.welcomeHeader}>
          <div className={styles.avatarManagementSection}>
            <div
              className={`${styles.avatarWrapper} ${isUploadingAvatar ? styles.avatarWrapperDisabled : ''}`}
              onClick={handleAvatarContainerClick}
              title={isUploadingAvatar ? "Загрузка..." : "Нажмите, чтобы сменить аватар"}
              role="button" tabIndex={isUploadingAvatar ? -1 : 0}
              onKeyDown={(e) => { if (!isUploadingAvatar && (e.key === 'Enter' || e.key === ' ')) handleAvatarContainerClick(); }}
              aria-disabled={isUploadingAvatar}
            >
              {isUploadingAvatar ? (
                <div className={styles.uploadingSpinner}></div>
              ) : (
                <>
                  <Image
                    key={currentDisplayAvatar} 
                    src={currentDisplayAvatar}
                    alt="Аватар пользователя"
                    width={140} height={140}
                    className={styles.avatarImage}
                    unoptimized 
                    priority 
                    onError={() => {
                      if (currentDisplayAvatar !== DEFAULT_AVATAR_URL) {
                        console.warn(`[UserProfileContent Image onError] Не удалось загрузить ${currentDisplayAvatar}. Установка аватара по умолчанию.`);
                        setCurrentDisplayAvatar(DEFAULT_AVATAR_URL);
                      }
                    }}
                  />
                  <div className={styles.avatarOverlayIconContainer}>
                    <span className={styles.avatarUploadCameraIcon}>📷</span>
                  </div>
                </>
              )}
            </div>
            <input
              type="file" ref={fileInputRef} className={styles.hiddenFileInput}
              onChange={handleFileSelected}
              accept="image/png, image/jpeg, image/jpg"
              disabled={isUploadingAvatar}
            />
            {avatarUploadMessage && (
              <p className={`${styles.uploadStatusMessage} ${avatarUploadMessage.type === 'error' ? styles.uploadError : styles.uploadSuccess
                }`}>
                {avatarUploadMessage.text}
              </p>
            )}
          </div>
          <h1>С возвращением, {name}!</h1>
        </div>

        <div className={styles.mainProgressBarOuter}>
          <div className={styles.mainProgressBarInner} style={{ width: `${mainProgressPercent}%` }}></div>
        </div>
        <p className={styles.mainProgressText}>
          Завершено {progress.completed} из {progress.total} шагов
        </p>
      </section>

      {!isProfileComplete && (
        <section className={`${styles.contentCard} ${styles.ctaCard}`}>
          <h2>Шаг {nextStepNumber}. Соберите свое резюме. ИИ вам в этом поможет!</h2>
          <p>Завершите все шаги по заполнению профиля и получите 100 XP</p>
          <Link href="/profile/resume" className={styles.ctaButton}>Создать</Link>
        </section>
      )}
      {isProfileComplete && (
        <section className={`${styles.contentCard} ${styles.ctaCard}`}>
          <h2>Профиль полностью заполнен!</h2>
          <p>Отлично! Теперь вы можете использовать все возможности платформы.</p>
        </section>
      )}

      <section className={styles.actionsGrid}>
        {profileActions.map(action => {
          const isActive = pathname === action.href;
          const IconComponent = action.iconComponent;
          return (
            <Link key={action.id} href={action.href}
              className={`${styles.actionItem} ${isActive ? styles.actionItemActive : ''}`}>
              <div className={styles.actionIconContainer}>
                <IconComponent className={`${styles.actionIconSvg} ${!isActive ? action.iconColorClass : ''}`} />
              </div>
              <span>{action.label}</span>
            </Link>
          );
        })}
      </section>
    </main>
  );
};

export default UserProfileContent;