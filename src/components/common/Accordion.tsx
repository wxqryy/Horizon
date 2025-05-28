'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  isOpen?: boolean;
  isBlue?: boolean;
  onToggle?: () => void;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({
  title,
  children,
  isOpen = false,
  isBlue = false,
  onToggle
}) => {
  const [isExpanded, setIsExpanded] = useState(isOpen);

  const handleToggle = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    if (onToggle) onToggle();
  };

  return (
    <div 
      className={`mb-4 rounded-[20px] overflow-hidden ${
        isBlue 
          ? 'border-[3px] border-[#366fff]' 
          : 'border-[2px] border-[#9d9d9dd9]'
      }`}
    >
      <div 
        className="flex justify-between items-center p-4 cursor-pointer"
        onClick={handleToggle}
      >
        <h3 
          className={`text-[32px] font-medium ${
            isBlue ? 'text-[#366fff] font-semibold' : 'text-[#2c2c2c]'
          }`}
        >
          {title}
        </h3>
        <div className="w-[44px] h-[44px] flex items-center justify-center">
          {isBlue ? (
            <Image 
              src="/images/img_plus_blue_a400.svg" 
              alt="Expand" 
              width={60} 
              height={60} 
            />
          ) : (
            <Image 
              src="/images/img_plus.svg" 
              alt="Expand" 
              width={44} 
              height={44} 
            />
          )}
        </div>
      </div>
      {isExpanded && (
        <div className="p-4 pt-0">
          {children}
        </div>
      )}
    </div>
  );
};

interface AccordionProps {
  children: React.ReactNode;
  className?: string;
}

const Accordion: React.FC<AccordionProps> = ({ children, className = '' }) => {
  return (
    <div className={`w-full ${className}`}>
      {children}
    </div>
  );
};

export default Accordion;