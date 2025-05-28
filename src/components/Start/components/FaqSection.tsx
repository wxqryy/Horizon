"use client";

import React, { useState } from 'react';
import Image from 'next/image'; 
import Link from 'next/link';
import styles from './FaqSection.module.css';

import plusIcon from "wxqryy/assets/Plus.png";    
import minusIcon from "wxqryy/assets/Minus.png";  

interface FaqAccordionItemProps {
  id: string;
  title: string;
  children: React.ReactNode;
  isExpanded: boolean;
  onToggle: (id: string) => void;
}

const FaqAccordionItem: React.FC<FaqAccordionItemProps> = ({
  id,
  title,
  children,
  isExpanded,
  onToggle,
}) => {

  return (
    <div
      className={`
        ${styles.accordionItemBaseFaq}
        ${isExpanded ? styles.expandedStateFaq : styles.collapsedStateFaq}
      `}
    >
      <div
        className={styles.accordionHeaderFaq}
        onClick={() => onToggle(id)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onToggle(id)}
        aria-expanded={isExpanded}
        aria-controls={`faq-content-${id}`}
      >
        <h3 className={`${styles.accordionTitleFaq} ${isExpanded ? styles.accordionTitleExpandedFaq : ''}`}>
          {title}
        </h3>
        <div className={styles.accordionIconWrapperFaq}>
          <Image
            src={isExpanded ? minusIcon : plusIcon} 
            alt={isExpanded ? "Закрыть" : "Открыть"}
            width={20} 
            height={20}
            className={styles.accordionIconFaq}
          />
        </div>
      </div>
      <div
        id={`faq-content-${id}`}
        className={styles.accordionContentWrapperFaq}
        style={{ maxHeight: isExpanded ? '500px' : '0px' }}
        aria-hidden={!isExpanded}
      >
        <div className={styles.accordionContentFaq}>
          {children}
        </div>
      </div>
    </div>
  );
};

const FaqSection: React.FC = () => {
  const [activeItemId, setActiveItemId] = useState<string | null>('1'); 

  const handleToggle = (itemId: string) => {
    setActiveItemId(prevId => (prevId === itemId ? null : itemId));
  };

  const faqData = [
    {
      id: 'faq1',
      title: "А что если у меня нет достижений?",
      content: "Не переживай! Для этого у нас есть стандартный трек, где ты можешь продемонстрировать свои навыки через решение кейса или задания."
    },
    {
      id: 'faq2',
      title: "Какие прикладные олимпиады учитываются?",
      contentComponent: (
        <>
          Со списком перечневых олимпиад Вы можете ознакомиться <Link href="https://sh7-dudinka-r52.gosweb.gosuslugi.ru/netcat_files/171/2953/Prikaz_Minnauki_i_VO_30.08.2024_571_Perechen_olimpiad_na_2024_2025_PEREChNEVYE.pdf" className={styles.faqLink} target="_blank" rel="noopener noreferrer">здесь</Link>
        </>
      ),
    },
    {
      id: 'faq3',
      title: "Чем ваша платформа отличается от других уже имеющихся?",
      content: "Мы создаем не просто платформу, а сообщество единомышленников с высокой мотивацией. Наш отбор помогает собрать людей, действительно заинтересованных в развитии, а партнерства с компаниями дают реальные возможности для карьерного роста."
    },
    {
      id: 'faq4',
      title: "Что делать, если я не прошёл отбор?",
      content: "Ты всегда можешь попробовать еще раз через 3 месяца. За это время мы рекомендуем поработать над навыками, которые требуют улучшения, и подготовиться лучше к следующей попытке."
    },
    {
      id: 'faq5',
      title: "А что если у меня нет достижений?",
      content: "Повторный ответ на этот вопрос для демонстрации пятого элемента."
    },
  ];

  return (
    <section className={styles.faqPageSection}>
      <div className={styles.faqContainer}>
        <h2 className={styles.sectionTitleFaq}>
          Часто задаваемые вопросы
        </h2>

        <div className={styles.accordionListContainerFaq}>
          {faqData.map((item) => (
            <FaqAccordionItem
              key={item.id}
              id={item.id}
              title={item.title}
              isExpanded={activeItemId === item.id}
              onToggle={handleToggle}
            >
              {item.contentComponent || <p>{item.content}</p>}
            </FaqAccordionItem>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;