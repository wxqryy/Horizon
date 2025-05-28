"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Header.module.css';
import { useAuth } from 'wxqryy/components/AuthProvider'; 
import ProfileSidebarMenu from './ProfileSidebarMenu'; 
import type { DecodedToken } from 'wxqryy/components/AuthProvider'; 

const MenuTriggerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.headerMenuTriggerIcon}>
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const Header: React.FC = () => {

  const { isAuthenticated, user, isLoadingAuth } = useAuth() as {
    isAuthenticated: boolean;
    user: DecodedToken | null; 
    isLoadingAuth: boolean;
  };

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileSidebarOpen, setIsProfileSidebarOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);
  const closeMobileMenu = () => { if (isMobileMenuOpen) setIsMobileMenuOpen(false); };

  const toggleProfileSidebar = () => setIsProfileSidebarOpen(prev => !prev);
  const closeProfileSidebar = () => { if (isProfileSidebarOpen) setIsProfileSidebarOpen(false); };

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    if (isMobileMenuOpen || isProfileSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = originalOverflow || 'unset'; 
    }

    return () => { document.body.style.overflow = originalOverflow || 'unset'; };
  }, [isMobileMenuOpen, isProfileSidebarOpen]);

  const DesktopNavigationLinks: React.FC = () => (
    <>
      {}
      <Link href="/">Главная</Link>
      <Link href="/about">О нас</Link>
      <Link href="/companies">Компаниям</Link>
      {}
    </>
  );

  const MobileNavigationLinks: React.FC = () => (
    <>
      <Link href="/" onClick={closeMobileMenu}>Главная</Link>
      <Link href="/about" onClick={closeMobileMenu}>О нас</Link>
      <Link href="/companies" onClick={closeMobileMenu}>Компаниям</Link>
      {isAuthenticated && user && (

        <Link href="/profile" onClick={closeMobileMenu}>Профиль</Link>
      )}
    </>
  );

  if (isLoadingAuth) {
    return (
      <header className={styles.header}>
        <Link href="/" className={styles.logo}>
          Horizon
        </Link>
        <nav className={`${styles.nav} ${styles.desktopNav}`}>
          <Link href="/">Главная</Link>
          <Link href="/about">О нас</Link>
          <Link href="/companies">Компаниям</Link>
        </nav>
        <div className={`${styles.authButtonPlaceholder} ${styles.desktopAuthControls}`} />
        <div className={styles.hamburgerPlaceholder} /> {}
      </header>
    );
  }

  return (
    <>
      <header className={styles.header}>
        <Link href="/" className={styles.logo} onClick={() => { closeMobileMenu(); closeProfileSidebar(); }}>
          Horizon {}
        </Link>

        {}
        <nav className={`${styles.nav} ${styles.desktopNav}`}>
          <DesktopNavigationLinks />
        </nav>

        {}
        <div className={`${styles.authControls} ${styles.desktopAuthControls}`}>
          {isAuthenticated && user ? (
            <div className={styles.profileSidebarTriggerContainer}>
              <button
                onClick={toggleProfileSidebar}
                className={`${styles.profileSidebarTriggerButton} ${isProfileSidebarOpen ? styles.profileSidebarTriggerButtonActive : ''}`}
                aria-label="Открыть меню профиля"
                aria-expanded={isProfileSidebarOpen}
                aria-controls="profile-sidebar-menu" 
              >
                <MenuTriggerIcon />
              </button>
            </div>
          ) : (
            <Link href="/login" className={styles.authButton}>
              Вход
            </Link>
          )}
        </div>

        {}
        <button
          className={`${styles.hamburgerButton} ${isMobileMenuOpen ? styles.hamburgerButtonActive : ''}`}
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-navigation-menu" 
        >
          <span className={styles.hamburgerBox}>
            <span className={styles.hamburgerInner}></span>
          </span>
        </button>
      </header>

      {}
      <div
        className={`${styles.overlay} ${isMobileMenuOpen ? styles.overlayActive : ''}`}
        onClick={toggleMobileMenu}
        role="button" 
        tabIndex={-1}  
        aria-label="Закрыть меню"
      />

      {}
      <div
        id="mobile-navigation-menu"
        className={`${styles.mobileNavMenu} ${isMobileMenuOpen ? styles.mobileNavMenuActive : ''}`}
        aria-hidden={!isMobileMenuOpen}
      >
        <nav className={styles.mobileNavLinks} aria-label="Мобильная навигация">
          <MobileNavigationLinks />
        </nav>
        <div className={styles.mobileAuthControls}>
          {isAuthenticated && user ? (
            <>
            <Link href="/logout" className={`${styles.authButton} ${styles.profileButtonMobile}`} onClick={closeMobileMenu}>
              Выйти
            </Link>
            </>
          ) : (
            <Link href="/login" className={styles.authButton} onClick={closeMobileMenu}>
              Вход
            </Link>
          )}
        </div>
      </div>

      {}
      {}
      {isAuthenticated && user && ( 
        <ProfileSidebarMenu

          isOpen={isProfileSidebarOpen}
          onClose={closeProfileSidebar}

        />
      )}
    </>
  );
};

export default Header;