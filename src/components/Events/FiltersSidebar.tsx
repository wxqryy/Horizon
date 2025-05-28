"use client";
import React from 'react';
import styles from './FiltersSidebar.module.css';

interface AppliedFiltersState {
    sort: string[];
    type: string[];
    format_filter: string[];
    topic: string[];
    searchTerm: string;
}

interface FilterOption {
    label: string;
    value: string;
}

interface FilterGroupProps {
    title: string;
    name: keyof Omit<AppliedFiltersState, 'searchTerm'>;
    options: FilterOption[];
    currentSelection: string[];
    onFilterChange: (filterType: keyof Omit<AppliedFiltersState, 'searchTerm'>, value: string, isChecked: boolean) => void;
    isLastGroup?: boolean; 
}

const FilterGroup: React.FC<FilterGroupProps> = ({ title, name, options, currentSelection, onFilterChange, isLastGroup }) => {
    return (
        <React.Fragment> {}
            <div className={styles.filterGroup}>
                <h4>{title}</h4>
                {options.map(option => (
                    <label key={option.value} htmlFor={`${name}-${option.value}`} className={styles.filterLabel}>
                        <input
                            type="checkbox"
                            id={`${name}-${option.value}`}
                            name={name}
                            value={option.value}
                            checked={currentSelection.includes(option.value)}
                            onChange={(e) => onFilterChange(name, option.value, e.target.checked)}
                        />
                        <span className={styles.labelText}>{option.label}</span>
                        <span className={styles.checkboxIndicator}></span>
                    </label>
                ))}
            </div>
            {!isLastGroup && <hr className={styles.filterSeparator} />} {}
        </React.Fragment>
    );
};

interface FiltersSidebarProps {
    onFilterChange: (filterType: keyof Omit<AppliedFiltersState, 'searchTerm'>, value: string, isChecked: boolean) => void;
    currentFilters: AppliedFiltersState;
    isOpen: boolean;
    onClose: () => void;
}

const sortOptions: FilterOption[] = [
    { label: "От новых к старым", value: "date_desc" },
    { label: "От старых к новым", value: "date_asc" },
    { label: "По умолчанию", value: "all_time" },
];

const typeOptions: FilterOption[] = [
    { label: "Дататоны", value: "Дататоны" },
    { label: "Олимпиады", value: "Олимпиады" },
    { label: "Кейсы", value: "Кейсы" },
    { label: "Хакатоны", value: "Хакатоны" },
];

const formatOptions: FilterOption[] = [
    { label: "Онлайн", value: "online" },
    { label: "Офлайн", value: "offline" },
];

const topicOptions: FilterOption[] = [
    { label: "Дизайн", value: "Дизайн" },
    { label: "Промышленная разработка", value: "Промышленная разработка" },
    { label: "Бизнес и Аналитика", value: "Бизнес и Аналитика" },
    { label: "ИИ", value: "ИИ" },
    { label: "Проекты", value: "Проекты" },
];

const FiltersSidebar: React.FC<FiltersSidebarProps> = ({ onFilterChange, currentFilters, isOpen, onClose }) => {
    return (
        <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
            <div className={styles.sidebarHeader}>
                <button className={styles.closeButton} onClick={onClose} aria-label="Закрыть фильтры">×</button>
            </div>
            <nav className={styles.filters}>
                <FilterGroup title="Сортировка" name="sort" options={sortOptions} currentSelection={currentFilters.sort} onFilterChange={onFilterChange} />
                <FilterGroup title="Тип" name="type" options={typeOptions} currentSelection={currentFilters.type} onFilterChange={onFilterChange} />
                <FilterGroup title="Формат" name="format_filter" options={formatOptions} currentSelection={currentFilters.format_filter} onFilterChange={onFilterChange} />
                <FilterGroup title="Тематика" name="topic" options={topicOptions} currentSelection={currentFilters.topic} onFilterChange={onFilterChange} isLastGroup={true} /> {}
            </nav>
        </aside>
    );
};

export default FiltersSidebar;