import React, { ReactNode, ButtonHTMLAttributes } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface CommonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  outline?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  icon?: ReactNode;
}

/** Map variants to solid vs outline styles */
const baseStyles = {
  solid: {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
  },
  outline: {
    primary: 'border border-indigo-600 text-indigo-600 hover:bg-indigo-50',
    secondary: 'border border-gray-600 text-gray-600 hover:bg-gray-50',
    danger: 'border border-red-600 text-red-600 hover:bg-red-50',
  },
};

/** Map variants to focus-ring colors */
const ringStyles: Record<ButtonVariant, string> = {
  primary: 'focus-visible:ring-indigo-500',
  secondary: 'focus-visible:ring-gray-500',
  danger: 'focus-visible:ring-red-500',
};

/** Map sizes to padding/text */
const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

const CommonButton: React.FC<CommonButtonProps> = ({
  label,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  outline = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  disabled,
  className = '',
  ...rest
}) => {
  const mode = outline ? 'outline' : 'solid';
  const variantClasses = baseStyles[mode][variant];
  const ringClass = ringStyles[variant];
  const sizeClass = sizeStyles[size];
  const widthClass = fullWidth ? 'w-full' : 'inline-flex';

  const disabledOrLoading = disabled || isLoading;

  const classes = [
    variantClasses,
    sizeClass,
    widthClass,
    'items-center justify-center rounded-md font-semibold',
    'transition duration-200 ease-in-out',
    ringClass,
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    disabledOrLoading ? 'opacity-50 cursor-not-allowed' : 'active:scale-95',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={classes}
      disabled={disabledOrLoading}
      {...rest}
    >
      {isLoading ? (
        <svg
          className="animate-spin h-5 w-5 mr-2"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          />
        </svg>
      ) : (
        leftIcon && <span className="mr-2 flex-shrink-0">{leftIcon}</span>
      )}

      {isLoading ? <span className="sr-only">Loading…</span> : label}

      {!isLoading && rightIcon && (
        <span className="ml-2 flex-shrink-0">{rightIcon}</span>
      )}
    </button>
  );
};

export default CommonButton;
