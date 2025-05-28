"use client";

import React from 'react';
import Image from 'next/image';
import styles from './EventCard.module.css';
import { EventData, Tag } from './EventsPageContent';

interface EventCardProps {
    event: EventData;
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

const EventCard: React.FC<EventCardProps> = ({ event }) => {
    const timeDisplay = (event.time_start && event.time_end)
        ? `${event.time_start}-${event.time_end}`
        : (event.time_start || '');

    return (
        <article className={styles.eventCard}>
            <div className={styles.eventImageContainer}>
                <Image
                    src={event.photo_url || '/events/placeholder-event.png'}
                    alt={event.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={false}
                />
                <div className={styles.imageOverlay}></div>
                <h3 className={styles.eventNameOnImage}>{event.name}</h3>

                {}
                {event.format === 'online' && (
                    <span className={`${styles.eventBadge} ${styles.eventBadgeOnline}`}>онлайн</span>
                )}
                {event.format === 'offline' && (
                    <span className={`${styles.eventBadge} ${styles.eventBadgeOffline}`}>офлайн</span>
                )}
                {event.format === 'online_offline' && (
                     <span className={`${styles.eventBadge} ${styles.eventBadgeHybrid}`}>онлайн + офлайн</span>
                )}
            </div>
            <div className={styles.eventInfo}>
                <p className={styles.eventDatetime}>
                    <span className={styles.eventDate}>{formatDate(event.event_date)}</span>
                    <span className={styles.eventTime}>{timeDisplay}</span>
                </p>
                <p className={styles.eventDescription}>
                    {event.description || 'Нет описания.'}
                </p>
                <div className={styles.eventTags}>
                    {event.tags.map((tag: Tag) => (
                        <span
                            key={tag.id}
                            className={styles.tag}
                            style={{ backgroundColor: tag.color || getRandomColor() }}
                        >
                            {tag.name}
                        </span>
                    ))}
                </div>
            </div>
        </article>
    );
};

export default EventCard;