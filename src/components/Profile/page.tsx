import React from 'react';
import { redirect } from 'next/navigation';
import UserProfileContent from 'wxqryy/components/Profile/UserProfileContent'; 
import MyPathSidebar from 'wxqryy/components/Profile/MyPathSidebar';         
import Footer from 'wxqryy/components/common/Footer'; 
import { getCurrentUserId } from 'wxqryy/lib/auth-utils'; 
import { getUserProfileDataForPage, getUserXpDataForPage } from 'wxqryy/lib/data'; 
import styles from './Profile.module.css'; 


export default async function ProfilePage() {
  const userId = await getCurrentUserId();

  if (!userId) {
    redirect('/login'); 
  }

  const [profileData, xpData] = await Promise.all([
    getUserProfileDataForPage(userId),
    getUserXpDataForPage(userId)
  ]);

  if (!profileData || !xpData) {

    console.error(`Profile data or XP data not found for user ID: ${userId}`);

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.mainArea}>
                <p>Не удалось загрузить данные профиля. Пожалуйста, попробуйте позже или обратитесь в поддержку.</p>
            </div>
            <Footer />
        </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.mainArea}>
        <div className={styles.contentLayout}>
          <UserProfileContent userData={profileData} />
          <div className={styles.myPathSidebarContainer}>
            <MyPathSidebar xpData={xpData} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}