'use client';
import React, { ButtonHTMLAttributes } from 'react';


interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'blue' | 'green' | 'orange';
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  className = '',
  ...props
}) => {

  const baseClasses = `
    font-medium rounded 
    transition-all duration-200 ease-in-out 
    transform 
    focus:outline-none 
    focus-visible:ring-2 
    focus-visible:ring-offset-2
  `;

  const variants = {
    primary: `
      bg-[#3b82f6] text-white 
      hover:bg-blue-700 hover:scale-105 hover:shadow-md
      active:bg-blue-800 active:scale-95
      focus-visible:ring-blue-400
    `,
    secondary: `
      bg-gray-200 text-gray-800 
      hover:bg-gray-300 hover:scale-105 hover:shadow-md
      active:bg-gray-400 active:scale-95
      focus-visible:ring-gray-400
    `,
    outline: `
      border border-gray-300 text-gray-700 
      hover:bg-gray-50 hover:scale-105 hover:shadow-md
      active:bg-gray-100 active:scale-95
      focus-visible:ring-gray-400
    `,
    blue: `
      bg-[#3b82f6] text-white 
      hover:bg-blue-700 hover:scale-105 hover:shadow-md
      active:bg-blue-800 active:scale-95
      focus-visible:ring-blue-400
    `,
    green: `
      bg-[#a3e635] text-[#2c2c2c]
      hover:bg-lime-500
      hover:shadow-lg 
      hover:scale-105
      active:bg-lime-700
      active:scale-95
      active:shadow-md
      focus-visible:ring-lime-300
    `,
    orange: `
      bg-[#f97316] text-white 
      hover:bg-orange-600 hover:scale-105 hover:shadow-md
      active:bg-orange-700 active:scale-95
      focus-visible:ring-orange-400
    `
  };

  const sizes = {
    small: 'px-3 py-1 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg'
  };

  const buttonClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <button
      className={buttonClasses.replace(/\s+/g, ' ').trim()}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;