import React, { Suspense } from 'react';
import VerifyEmailForm from './VerifyEmail'; 
import styles from './VerifyEmail.module.css'; 

const VerifyEmailLoadingFallback = () => {
  return (
    <div className={styles.pageContainer} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div className={styles.verificationCard} style={{ textAlign: 'center', padding: '20px' }}>
        <p>Загрузка страницы подтверждения...</p>
        {}
      </div>
    </div>
  );
};

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<VerifyEmailLoadingFallback />}>
      <VerifyEmailForm />
    </Suspense>
  );
}