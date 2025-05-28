"use client";

import React, { useState, useEffect, useCallback } from 'react';
import FiltersSidebar from './FiltersSidebar';
import EventCard from './EventCard';
import EventModal from './EventModal';
import styles from './EventsPage.module.css';

export interface Tag {
    id: number;
    name: string;
    color?: string | null;
}

export interface EventData {
    id: number;
    name: string;
    event_date: string;
    time_start?: string | null;
    time_end?: string | null;
    format: 'online' | 'offline' | 'online_offline';
    description?: string | null;
    photo_url?: string | null;
    link?: string | null;
    tags: Tag[];
}

export interface AppliedFiltersState {
    sort: string[];
    type: string[];
    format_filter: string[];
    topic: string[];
    searchTerm: string;
}

export default function EventsPage() {
    const [allEvents, setAllEvents] = useState<EventData[]>([]);
    const [displayedEvents, setDisplayedEvents] = useState<EventData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [filters, setFilters] = useState<AppliedFiltersState>({
        sort: ["all_time"],
        type: [],
        format_filter: [],
        topic: [],
        searchTerm: '',
    });

    const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const fetchEvents = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/events');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data: EventData[] = await response.json();
            setAllEvents(data);
        } catch (e) {
            console.error("Не удалось загрузить мероприятия:", e);
            setError(e instanceof Error ? e.message : 'Произошла ошибка загрузки.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const applyFilters = useCallback(() => {
        let filtered = [...allEvents];

        if (filters.searchTerm) {
            const term = filters.searchTerm.toLowerCase();
            filtered = filtered.filter(event =>
                event.name.toLowerCase().includes(term) ||
                (event.description && event.description.toLowerCase().includes(term))
            );
        }

        if (filters.format_filter.length > 0) {
            filtered = filtered.filter(event => filters.format_filter.includes(event.format));
        }

        if (filters.type.length > 0) {
            filtered = filtered.filter(event => 
                event.tags.some(tag => filters.type.map(t => t.toLowerCase()).includes(tag.name.toLowerCase()))
            );
        }

        if (filters.topic.length > 0) {
             filtered = filtered.filter(event =>
                event.tags.some(tag => filters.topic.map(t => t.toLowerCase()).includes(tag.name.toLowerCase()))
            );
        }

        if (filters.sort.includes('date_asc')) {
            filtered.sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime());
        } else if (filters.sort.includes('date_desc')) {
             filtered.sort((a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime());
        }

        setDisplayedEvents(filtered);
    }, [allEvents, filters]);

    useEffect(() => {
        applyFilters();
    }, [allEvents, filters, applyFilters]);

    const handleFilterChange = (
        filterType: keyof Omit<AppliedFiltersState, 'searchTerm'>,
        value: string,
        isChecked: boolean
    ) => {
        setFilters(prevFilters => {
            const newFilters = { ...prevFilters };
            if (filterType === 'sort') {
                if (isChecked) {
                    newFilters.sort = [value];
                } else {
                    newFilters.sort = newFilters.sort.filter(v => v !== value);
                    if (newFilters.sort.length === 0) {
                        newFilters.sort = ['all_time']; 
                    }
                }
            } else {
                let currentValues = [...newFilters[filterType]];
                if (isChecked) {
                    if (!currentValues.includes(value)) {
                        currentValues.push(value);
                    }
                } else {
                    currentValues = currentValues.filter(v => v !== value);
                }
                newFilters[filterType] = currentValues;
            }
            return newFilters;
        });
    };

    const handleSearchChange = (term: string) => {
        setFilters(prevFilters => ({ ...prevFilters, searchTerm: term }));
    };

    const openModalWithEvent = (event: EventData) => {
        setSelectedEvent(event);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setSelectedEvent(null);
        document.body.style.overflow = '';
    };

    useEffect(() => {
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    if (isLoading) return <p className={styles.loading}>Загрузка мероприятий...</p>;
    if (error) return <p className={styles.error}>Ошибка: {error}</p>;

    return (
        <div className={styles.appContainer}>
            <FiltersSidebar 
                onFilterChange={handleFilterChange} 
                currentFilters={filters}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />
            <main className={styles.mainContent}>
                <header className={styles.pageHeader}>
                    <div className={styles.headerTextContent}>
                        <h1>Горизонт событий</h1>
                        <p>Тысячи мероприятий в одном месте. Здесь ты точно найдешь себе что-нибудь по душе!</p>
                    </div>
                    <button 
                        className={styles.menuToggle} 
                        aria-label="Открыть меню фильтров"
                        onClick={() => setIsSidebarOpen(prev => !prev)}
                    >
                        <svg viewBox="0 0 100 80" width="30" height="30">
                          <rect width="100" height="15" rx="8"></rect>
                          <rect y="30" width="100" height="15" rx="8"></rect>
                          <rect y="60" width="100" height="15" rx="8"></rect>
                        </svg>
                    </button>
                </header>

                <div className={styles.searchArea}>
                    <div className={styles.searchWrapper}>
                        <div className={styles.searchContainer}>
                            <input
                                type="search"
                                placeholder="Найти нужное мероприятие"
                                value={filters.searchTerm}
                                onChange={(e) => handleSearchChange(e.target.value)}
                            />
                            <span className={styles.searchIcon}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            </span>
                        </div>
                    </div>

                    {displayedEvents.length > 0 ? (
                        <section className={styles.eventsGrid}>
                            {displayedEvents.map(event => (
                                <div 
                                    key={event.id} 
                                    onClick={() => openModalWithEvent(event)} 
                                    className={styles.eventCardClickableWrapper}
                                >
                                    <EventCard event={event} />
                                </div>
                            ))}
                        </section>
                    ) : (
                        <p className={styles.noEvents}>По вашему запросу мероприятий не найдено.</p>
                    )}
                </div>
            </main>
             <div className={styles.backgroundWave}>
                <svg viewBox="0 0 100 750" preserveAspectRatio="none">
                    <path d="M0,0 Q25,100 50,50 T100,150 L100,200 Q75,250 50,300 T0,350 L0,400 Q25,500 50,450 T100,550 L100,600 Q75,650 50,700 T0,750 Z" />
                </svg>
            </div>

            <EventModal event={selectedEvent} onClose={closeModal} />
        </div>
    );
}