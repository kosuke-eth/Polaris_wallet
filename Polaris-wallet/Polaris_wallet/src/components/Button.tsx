import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean;
  variant?: 'filled' | 'outlined';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  isActive = true,
  variant = 'filled',
  ...props
}) => {
  const baseClasses = `
    flex 
    items-center 
    justify-center 
    px-6 
    py-3 
    rounded-full 
    font-medium 
    text-sm 
    tracking-wide
    uppercase
    transition-all 
    duration-300 
    ease-in-out
    transform
    shadow-sm
    hover:shadow-md
    focus:outline-none 
    focus:ring-2 
    focus:ring-offset-2 
    focus:ring-orange-200
  `;

  const variantClasses = variant === 'filled'
    ? `
      bg-orange-100 
      text-orange-800
      hover:bg-orange-200
      active:bg-orange-300
    `
    : `
      bg-transparent
      text-orange-500
      border-2 
      border-orange-300
      hover:bg-orange-50
      active:bg-orange-100
    `;

  const stateClasses = isActive
    ? `
      hover:-translate-y-0.5
      active:translate-y-0.5
    `
    : `
      opacity-50 
      cursor-not-allowed
    `;

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${stateClasses}`}
      disabled={!isActive}
      {...props}
    >
      {children}
    </button>
  );
};
