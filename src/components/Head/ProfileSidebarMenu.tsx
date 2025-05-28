"use client";

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './ProfileSidebarMenu.module.css';
import { useRouter, usePathname } from 'next/navigation';

const HomeIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className={styles.menuIcon}><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"></path></svg>;
const ProjectsIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className={styles.menuIcon}><path d="M20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 14h-2v-2h2v2zm0-4h-2v-2h2v2zm-4-4H8V6h6v2zm-4 8H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V6h2v2zm10 8h-2v-2h2v2zm0-4h-2v-2h2v2z"></path></svg>;
const PublicationsIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className={styles.menuIcon}><path d="M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V6h5.17l2 2H20v10z"></path></svg>;
const EventsIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className={styles.menuIcon}><path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"></path></svg>;
const CareerIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className={styles.menuIcon}><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path></svg>;

const HamburgerCloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.closeIcon}>
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const LogoutIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={styles.menuIcon}>
    <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5-5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"></path>
  </svg>
);

interface ProfileSidebarMenuProps {
  isOpen: boolean;
  onClose: () => void;

}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactElement; 
  href: string;

}

const ProfileSidebarMenu: React.FC<ProfileSidebarMenuProps> = ({ isOpen, onClose }) => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isOpen && sidebarRef.current) {

      const focusableElements = sidebarRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    }
  }, [isOpen]);

  const menuItems: MenuItem[] = [

    { id: 'my-hub', label: 'Мой профиль', icon: <HomeIcon />, href: '/profile' },
    { id: 'projects', label: 'Проекты и команды', icon: <ProjectsIcon />, href: '/projects' },
    { id: 'publications', label: 'Публикации', icon: <PublicationsIcon />, href: '/publications' },
    { id: 'events', label: 'Мероприятия', icon: <EventsIcon />, href: '/events' },
    { id: 'career', label: 'Карьера и Стажировки', icon: <CareerIcon />, href: '/career' },
  ];

  const handleLogout = async () => {

    console.log("ProfileSidebarMenu: Инициирован выход...");
    router.push(`/logout`); 

    onClose(); 

  };

  return (
    <>
      <div
        className={`${styles.sidebarOverlay} ${isOpen ? styles.sidebarOverlayActive : ''}`}
        onClick={onClose}
        aria-hidden="true" 
      />
      <aside
        ref={sidebarRef}
        className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}
        aria-label="Меню профиля" 

        aria-hidden={!isOpen} 

        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            onClose();
          }
        }}
      >
        <div className={styles.sidebarHeader}>
          {}
          {}
          <button onClick={onClose} className={styles.closeButton} aria-label="Закрыть меню профиля">
            <HamburgerCloseIcon />
          </button>
        </div>
        <nav className={styles.sidebarNav} aria-label="Основная навигация профиля">
          <ul className={styles.menuList}>
            {menuItems.map((item) => {

              const isActive = pathname === item.href || 
                               (item.href !== '/' && pathname.startsWith(item.href + '/'));
              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className={`${styles.menuItem} ${isActive ? styles.menuItemActive : ''}`}
                    onClick={onClose} 
                    aria-current={isActive ? 'page' : undefined} 
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className={styles.sidebarFooter}>
          <button onClick={handleLogout} className={styles.logoutButton}>
            <LogoutIcon />
            <span>Выйти</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default ProfileSidebarMenu;