// src/components/common/Card.tsx
import React, { ReactNode } from 'react';

interface CardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  className?: string;
  onClick?: () => void;
  children?: ReactNode;
}

const Card = React.memo(
  ({ title, value, icon, className = '', onClick, children }: CardProps) => {
    // Determine cursor style and accessibility properties if onClick exists.
    const cursorStyle = onClick ? 'cursor-pointer' : 'cursor-default';
    const accessibilityProps = onClick ? { role: 'button', tabIndex: 0 } : {};

    return (
      <div
        onClick={onClick}
        {...accessibilityProps}
        className={`bg-black bg-opacity-50 border border-indigo-500 p-6 rounded-xl shadow-xl transform hover:scale-105 transition-all duration-300 ${cursorStyle} ${className}`}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          {icon && <div className="text-3xl">{icon}</div>}
        </div>
        <p className="mt-4 text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
          {value}
        </p>
        {children && <div className="mt-4">{children}</div>}
      </div>
    );
  }
);

Card.displayName = 'Card';
export default Card;
