'use client';

import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'green' | 'red' | 'blue';
}

const Card: React.FC<CardProps> = ({
  title,
  children,
  className = '',
  variant = 'default'
}) => {
  const variantClasses = {
    default: 'bg-white',
    green: 'bg-[#a3e635]',
    red: 'bg-[#F97316]',
    blue: 'bg-[#3b82f6]'
  };

  return (
    <div className={`rounded-[30px] overflow-hidden shadow-md ${variantClasses[variant]} ${className}`}>
      {title && (
        <div className="px-6 py-4 border-b">
          <h3 className="text-xl font-semibold">{title}</h3>
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default Card;