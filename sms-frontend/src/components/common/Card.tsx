// src/components/Card.tsx

import React from "react";

// Extend the default div attributes with custom props for the Card component.
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string; // Optional title to display at the top of the card.
  children: React.ReactNode; // Content to be rendered inside the card.
}

/**
 * Futuristic Card Component
 *
 * This component provides a visually appealing container using a glassmorphism effect.
 * It is designed with advanced coding practices to ensure a secure and accessible UI.
 *
 * Security & Accessibility Considerations:
 * - TypeScript ensures strict type checking to reduce runtime errors.
 * - All additional props (e.g., aria-label, role) are spread to the container for enhanced accessibility.
 * - The design is encapsulated, minimizing style leakage and unexpected behavior.
 *
 * @param {CardProps} props - The properties for the Card component, including an optional title and children.
 * @returns {JSX.Element} A styled card container.
 */
const Card: React.FC<CardProps> = ({ title, children, className, ...rest }) => {
  return (
    <div
      // Spread additional props (like aria-label, role, etc.) for security and accessibility.
      {...rest}
      // Combine custom classes with any additional classes passed via props.
      className={`bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg p-6 rounded-lg shadow-lg ${className ?? ""}`}
    >
      {/* Optional title section */}
      {title && (
        <h3 className="text-2xl font-semibold mb-4 text-white">
          {title}
        </h3>
      )}
      {/* Main content area */}
      <div className="text-white">
        {children}
      </div>
    </div>
  );
};

export default Card;
