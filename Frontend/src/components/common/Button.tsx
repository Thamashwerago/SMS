import React from 'react';

/**
 * ButtonVariant - Defines the types of visual variants for the button.
 */
export type ButtonVariant = 'primary' | 'secondary' | 'danger';

/**
 * CommonButtonProps - Extends the default button props and adds:
 * - label: The text to display on the button.
 * - variant: The visual style of the button (default: primary).
 * - isLoading: Flag to show a loading spinner.
 */
export interface CommonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  variant?: ButtonVariant;
  isLoading?: boolean;
}

/**
 * variantClasses - Maps each ButtonVariant to Tailwind CSS classes.
 */
const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-indigo-600 hover:bg-indigo-700 text-white",
  secondary: "bg-gray-600 hover:bg-gray-700 text-white",
  danger: "bg-red-600 hover:bg-red-700 text-white",
};

/**
 * CommonButton Component
 * ------------------------
 * A highly customizable button component that can be used across your application.
 * It supports different variants, a loading state, and all standard button properties.
 *
 * @param props - CommonButtonProps
 * @returns A JSX button element.
 */
const CommonButton: React.FC<CommonButtonProps> = ({
  label,
  variant = 'primary',
  isLoading = false,
  disabled,
  className = '',
  ...rest
}) => {
  // Compute the final classes for the button, including conditional disabled styles.
  const computedClass = `${variantClasses[variant]} px-6 py-2 rounded-md font-bold transition duration-300 ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`;
  
  return (
    <button disabled={disabled || isLoading} className={computedClass} {...rest}>
      {isLoading ? (
        <span className="flex items-center justify-center">
          {/* Loading Spinner */}
          <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          Loading...
        </span>
      ) : (
        label
      )}
    </button>
  );
};

export default CommonButton;
