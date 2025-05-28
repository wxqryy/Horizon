"use client";

import React, { useEffect } from 'react';
import Image from 'next/image';
import styles from './EventModal.module.css';
import { EventData, Tag } from './EventsPageContent'; 

interface EventModalProps {
    event: EventData | null;
    onClose: () => void;
}

const formatDate = (dateString?: string): string => {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch (e) {
        console.error("Error formatting date:", e);
        return dateString;
    }
};

const defaultTagColors: string[] = ['#4A90E2', '#F5A623', '#7ED321', '#9013FE', '#D0021B', '#BD10E0', '#4A4A4A'];
const getRandomColor = (): string => {
    return defaultTagColors[Math.floor(Math.random() * defaultTagColors.length)];
};

const EventModal: React.FC<EventModalProps> = ({ event, onClose }) => {

    useEffect(() => {
        if (!event) {
            return;
        }

        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', handleEsc);

        return () => {
            document.removeEventListener('keydown', handleEsc);
        };
    }, [event, onClose]);

    if (!event) {
        return null;
    }

    const timeDisplay = (event.time_start && event.time_end)
        ? `${event.time_start} - ${event.time_end}`
        : (event.time_start || 'Время не указано');

    return (
        <div className={styles.modalBackdrop} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose} aria-label="Закрыть">
                    ×
                </button>

                {}
                <div className={styles.modalImageContainer}>
                    <Image
                        src={event.photo_url || '/events/placeholder-event.png'} 
                        alt={event.name}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="(max-width: 768px) 100vw, 800px" 
                        priority 
                    />
                    <div className={styles.imageOverlayModal}></div>
                    <h2 className={styles.eventNameOnImageModal}>{event.name}</h2>

                    {event.tags && event.tags.length > 0 && (
                        <div className={styles.tagsOnImageModal}>
                            {event.tags.map((tag: Tag) => (
                                <span
                                    key={tag.id}
                                    className={styles.tagOnImage}
                                    style={{ backgroundColor: tag.color || getRandomColor() }}
                                >
                                    {tag.name}
                                </span>
                            ))}
                        </div>
                    )}

                    {event.format === 'online' && (
                        <span className={`${styles.eventBadgeModal} ${styles.eventBadgeOnlineModal}`}>онлайн</span>
                    )}
                    {event.format === 'offline' && (
                        <span className={`${styles.eventBadgeModal} ${styles.eventBadgeOfflineModal}`}>офлайн</span>
                    )}
                    {event.format === 'online_offline' && (
                        <span className={`${styles.eventBadgeModal} ${styles.eventBadgeHybridModal}`}>онлайн + офлайн</span>
                    )}
                </div>

                {}
                <div className={styles.modalInfo}>
                    <h4 className={`${styles.modalSectionTitle} ${styles.descriptionTitle}`}>Описание:</h4>

                    {event.description?.split('\n').map((paragraph, index) => (
                        <p key={index} className={styles.modalDescriptionParagraph}>
                            {paragraph.trim() === '' ? <> </> : paragraph} {}
                        </p>
                    ))}

                    {(event.event_date || timeDisplay !== 'Время не указано') && (
                        <div className={styles.modalSection}>
                            <h4 className={styles.modalSectionTitle}>Сроки проведения:</h4>
                            <p className={styles.modalText}>
                                {event.event_date ? formatDate(event.event_date) : ''}
                                {event.event_date && timeDisplay !== 'Время не указано' ? ', ' : ''}
                                {timeDisplay !== 'Время не указано' ? timeDisplay : ''}
                            </p>
                        </div>
                    )}

                    {event.link && (
                        <a href={event.link} target="_blank" rel="noopener noreferrer" className={styles.modalActionButton}>
                            Перейти
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EventModal;