import React, { ReactNode, KeyboardEvent } from 'react';
import {
  CARD_BASE_CLASS,
  CARD_TITLE_CLASS,
  CARD_VALUE_CLASS,
} from '../../constants/components/cardStrings';

export interface CardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  className?: string;
  onClick?: () => void;
  children?: ReactNode;
  loading?: boolean;
  tooltip?: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
}

const variantBg: Record<string, string> = {
  default: 'bg-white dark:bg-gray-800',
  primary: 'bg-indigo-50 dark:bg-indigo-900',
  success: 'bg-green-50 dark:bg-green-900',
  warning: 'bg-yellow-50 dark:bg-yellow-900',
  danger: 'bg-red-50 dark:bg-red-900',
};

const Card: React.FC<CardProps> = React.memo(
  ({
    title,
    value,
    icon,
    className = '',
    onClick,
    children,
    loading = false,
    tooltip,
    variant = 'default',
  }: CardProps) => {
    const isClickable = Boolean(onClick);

    const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
      if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        onClick?.();
      }
    };

    // Build up all the classes in one place
    const baseClasses = [
      CARD_BASE_CLASS,
      variantBg[variant],
      'rounded-2xl shadow-sm',
      'transition-transform duration-200',
      isClickable
        ? 'cursor-pointer hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500'
        : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    // 1) Loading state: skeleton placeholder
    if (loading) {
      return (
        <div className={`${baseClasses} animate-pulse`}>
          <div className="h-5 bg-gray-300 rounded w-3/4 mb-2" />
          <div className="h-8 bg-gray-300 rounded w-1/2 mb-2" />
          {children && <div className="h-4 bg-gray-300 rounded w-full" />}
        </div>
      );
    }

    // 2) Actual content
    const content = (
      <>
        <div className="flex items-center justify-between mb-2">
          <p className={CARD_TITLE_CLASS}>{title}</p>
          {icon && <span className="ml-2">{icon}</span>}
        </div>
        <p
          className={CARD_VALUE_CLASS}
          title={tooltip ?? (typeof value === 'string' ? value : undefined)}
        >
          {value}
        </p>
        {children && <div className="mt-4">{children}</div>}
      </>
    );

    // 3) Render as <button> if clickable, otherwise <div>
    return isClickable ? (
      <button
        type="button"
        onClick={onClick}
        onKeyDown={handleKeyDown}
        className={baseClasses}
      >
        {content}
      </button>
    ) : (
      <div className={baseClasses}>{content}</div>
    );
  }
);

Card.displayName = 'Card';
export default Card;
