// src/components/Button.tsx

import React, { ButtonHTMLAttributes } from "react";

// Extend the built-in button attributes to include our custom props.
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string; // The text displayed inside the button.
}

/**
 * Futuristic Button Component
 *
 * This component renders a button with a modern, gradient-based design.
 * It is built using React and Tailwind CSS with advanced coding practices.
 *
 * Security & Accessibility Considerations:
 * - TypeScript ensures type safety and prevents unexpected behavior.
 * - The component accepts additional attributes (via the rest operator) for secure
 *   customization, such as aria-labels for accessibility.
 * - Event handlers (like onClick) are handled in a controlled manner, reducing risks
 *   associated with inline script execution.
 * - Developers can pass props like 'disabled' or 'aria-*' attributes to further enhance security and usability.
 *
 * @param {ButtonProps} props - Props containing text, onClick handler, and other attributes.
 * @returns {JSX.Element} A styled button element.
 */
const Button: React.FC<ButtonProps> = ({ text, onClick, type = "button", ...rest }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      // Tailwind CSS classes for a futuristic look:
      // - A gradient background creates a dynamic, modern feel.
      // - Rounded-full and shadow classes add depth and interactivity.
      // - Focus and hover states are styled for enhanced usability and security (visible focus ring).
      className="px-6 py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-300 transition duration-300 ease-in-out"
      {...rest} // Spread additional props like aria-label, disabled, etc.
    >
      {text}
    </button>
  );
};

export default Button;
