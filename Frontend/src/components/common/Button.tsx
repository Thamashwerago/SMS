// src/components/common/Button.tsx
import React, { FC, ReactNode } from 'react';

interface ButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  children: ReactNode;
  className?: string;
  loading?: boolean;
  icon?: ReactNode;
}

const Button: FC<ButtonProps> = React.memo(({
  onClick,
  disabled = false,
  type = 'button',
  children,
  className = '',
  loading = false,
  icon,
}) => {

  const renderIcon = () => {
    if (loading) {
      return (
        <svg
          className="animate-spin h-5 w-5 mr-2 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          ></path>
        </svg>
      );
    }
    
    if (icon) {
      return <span className="mr-2">{icon}</span>;
    }
    
    return null;
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center px-4 py-2 rounded-md font-bold transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500
      ${disabled || loading ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer'}
      ${className}`}
    >
      {renderIcon()}
      {children}
    </button>
  );
});

export default Button;
