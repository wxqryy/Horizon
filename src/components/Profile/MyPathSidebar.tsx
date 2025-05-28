"use client";
import React from 'react';
import styles from './MyPathSidebar.module.css'; 
import Image from 'next/image';
import Link from 'next/link';
import profileTarget from 'wxqryy/assets/profile_target.png'; 
import type { UserXpPageData } from 'wxqryy/lib/data'; 


const PathTargetIcon = () => (
  <div>
    <Image src={profileTarget} alt="Декорация цель" width={40} height={40} />
  </div>
);
interface MyPathSidebarProps {
  xpData: UserXpPageData | null; 
}
const MyPathSidebar: React.FC<MyPathSidebarProps> = ({ xpData }) => {
  if (!xpData) {

    return (
      <aside className={styles.myPathSidebar}>
        <div className={styles.sidebarCard}>
          <div className={styles.myPathHeader}>
            <PathTargetIcon />
            <h2>Мой путь</h2>
          </div>
          <p>Не удалось загрузить данные об опыте.</p>
        </div>
      </aside>
    );
  }

  const {
    level,
    currentXP,

    xpForNextLevel,
    progressToNextLevelPercent,
    xpToLevelUp,
    isMaxLevel,
  } = xpData;
  const displayNextLevel = isMaxLevel ? level : level + 1;
  return (
    <aside className={styles.myPathSidebar}>
      <div className={styles.sidebarCard}>
        <div className={styles.myPathHeader}>
          <PathTargetIcon />
          <h2>Мой путь</h2>
        </div>

        <div className={styles.xpDetails}>
          <p>
            Уровень: <span className={styles.xpValue}>{level}</span>
          </p>
          <p>
            XP: <span className={styles.xpValue}>{currentXP}</span>
            {!isMaxLevel && xpForNextLevel !== null && (
              <span className={styles.xpThreshold}> / {xpForNextLevel}</span>
            )}
            <Link href="/xp-history" className={styles.xpTag} role="button">
              Начисления
            </Link>
          </p>

          {!isMaxLevel ? (
            <div className={styles.sidebarProgressSection}>
              <p>Прогресс до уровня {displayNextLevel}:</p>
              <div className={styles.sidebarProgressContainer}>
                <div className={styles.sidebarProgressBarOuter}>
                  <div
                    className={styles.sidebarProgressBarInner}
                    style={{ width: `${progressToNextLevelPercent}%` }}
                  ></div>
                </div>
                <span className={styles.sidebarProgressPercent}>{progressToNextLevelPercent}%</span>
              </div>
              {xpToLevelUp !== null && xpToLevelUp > 0 && (
                <p className={styles.xpRemaining}>Осталось {xpToLevelUp} XP до уровня {displayNextLevel}</p>
              )}
              {}
              {xpToLevelUp === 0 && !isMaxLevel && (
                 <p className={styles.xpRemaining}>Цель достигнута! Вы на пороге уровня {displayNextLevel}!</p>

              )}
            </div>
          ) : (
            <div className={styles.sidebarProgressSection}>
              <p className={styles.xpRemaining}>Вы достигли максимального уровня ({level})!</p>
              <div className={styles.sidebarProgressContainer}>
                <div className={styles.sidebarProgressBarOuter}>
                  <div
                    className={styles.sidebarProgressBarInner}
                    style={{ width: `100%` }}
                  ></div>
                </div>
                <span className={styles.sidebarProgressPercent}>100%</span>
              </div>
            </div>
          )}
        </div>

        <div className={styles.earnMoreXp}>
          <h3>Зарабатывай больше XP:</h3>
          <ul>
            <li>Собери резюме</li>
            <li>Отправь заявку на проект</li>
          </ul>
          <Link href="/xp-details" className={styles.detailsLink}>
            Подробнее об XP
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default MyPathSidebar;