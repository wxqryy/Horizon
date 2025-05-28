import Image from 'next/image';
import styles from './NotFound.module.css';

import backgroundImageFile from '../../assets/404_back.png';
import Link from 'next/link';

const NotFound = () => {
  return (
    <div className={styles.container}>
      <Image
        src={backgroundImageFile}
        alt="Фон страницы не найден"
        layout="fill"
        objectFit="cover"
        quality={75}
        priority
        className={styles.backgroundImage}
      />
      <div className={styles.overlay}>
        <div className={styles.popup}>
          <h1 className={styles.errorCode}>404</h1>
          <p className={styles.message}>Страница не найдена</p>
          <Link href="/" className={styles.homeLink}>
            Вернуться на главную
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;