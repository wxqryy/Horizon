"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import styles from './OfferingsSection.module.css'; 
import arrowDownSrc from "wxqryy/assets/img_1_20x36.png"; 
import arrowUpSrc from "wxqryy/assets/img_2_20x36.png";   

interface AccordionItemProps {
  id: string;
  number: string;
  title: string;
  description: string;
  isExpanded: boolean;
  onToggle: (id: string) => void;
  itemClassName?: string; 
}

const AccordionItem: React.FC<AccordionItemProps> = ({
  id,
  number,
  title,
  description,
  isExpanded,
  onToggle,
  itemClassName, 
}) => {
  const bgColor = isExpanded ? styles.expandedBg : styles.collapsedBg;
  const textColor = isExpanded ? styles.expandedText : styles.collapsedText;
  const numberColor = isExpanded ? styles.expandedNumber : styles.collapsedNumber;
  const borderColor = isExpanded ? styles.expandedBorder : styles.collapsedBorder;


  return (
    <div 
      className={`
        ${styles.accordionItemBase} 
        ${itemClassName || ''} 
        ${bgColor} 
        ${borderColor}
        ${isExpanded ? styles.expandedItemState : ''}
      `}
    >
      <div 
        className={styles.accordionHeader}
        onClick={() => onToggle(id)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onToggle(id)}
        aria-expanded={isExpanded}
        aria-controls={`content-${id}`}
      >
        <span className={`${styles.accordionNumber} ${numberColor}`}>
          {number}
        </span>
        <h3 className={`${styles.accordionTitle} ${textColor}`}>
          {title}
        </h3>
        <div className={styles.accordionIconWrapper}>
          <Image 
            src={isExpanded ? arrowUpSrc : arrowDownSrc} 
            alt={isExpanded ? "Свернуть" : "Развернуть"}
            width={18} 
            height={10} 
            className={styles.accordionIcon} 
          />
        </div>
      </div>
      <div
        id={`content-${id}`}
        className={styles.accordionContentWrapper}
        style={{ maxHeight: isExpanded ? '500px' : '0px' }} 
        aria-hidden={!isExpanded}
      >
        <div className={`${styles.accordionContent} ${textColor}`}>
          <p>
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

const OfferingsSection: React.FC = () => {
  const [activeItemId, setActiveItemId] = useState<string | null>(null); 

  const toggleItem = (id: string) => {
    setActiveItemId(prevId => (prevId === id ? null : id));
  };

  const offerings = [
    { id: 'item1', number: '01', title: 'Круг единомышленников', description: 'Сообщество мотивированных студентов и школьников, готовых развиваться и делиться опытом.' },
    { id: 'item2', number: '02', title: 'Реальные проекты', description: 'Получай практический опыт, работая над актуальными проектами от компаний или собственными стартапами. Собирай команду или присоединяйся к существующей.' },
    { id: 'item3', number: '03', title: 'Карьерные возможности', description: 'Доступ к стажировкам, вакансиям и карьерным возможностям от наших партнеров.' },
    { id: 'item4', number: '04', title: 'Инструменты для развития', description: 'Образовательные материалы, мастер-классы и менторская поддержка для твоего профессионального роста.' },
  ];

  return (
    <section className={styles.offeringsPageSection}>
      <div className={styles.offeringsContainer}>
        <h2 className={styles.sectionTitle}>
          Что мы предлагаем
        </h2>

        <div className={styles.accordionListContainer}>
          {offerings.map((item, index) => (
            <AccordionItem
              key={item.id}
              id={item.id}
              number={item.number}
              title={item.title}
              description={item.description}
              isExpanded={activeItemId === item.id}
              onToggle={toggleItem}
              itemClassName={`${styles.accordionItemPositioning} ${index > 0 ? styles.accordionItemOverlapEffect : ''}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default OfferingsSection;