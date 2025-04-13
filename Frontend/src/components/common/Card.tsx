import React, { ReactNode } from "react";
import {
  CARD_BASE_CLASS,
  CARD_TITLE_CLASS,
  CARD_VALUE_CLASS,
} from "../../constants/components/cardStrings";

/**
 * CardProps - Defines the properties for the Card component.
 * @property title - The title text displayed on the card.
 * @property value - The main value or metric to display.
 * @property icon - An optional icon to display alongside the title.
 * @property className - Additional custom class names.
 * @property onClick - Optional click handler for the card.
 * @property children - Optional additional content to render below the value.
 */
export interface CardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  className?: string;
  onClick?: () => void;
  children?: ReactNode;
}

/**
 * Card Component
 * ----------------
 * A reusable, accessible card component that displays a title, value,
 * and optionally an icon and additional children content.
 *
 * It applies a consistent, futuristic UI style using Tailwind CSS classes.
 *
 * @param {CardProps} props - Component properties.
 * @returns A styled card element.
 */
const Card: React.FC<CardProps> = React.memo(
  ({ title, value, icon, className = "", onClick, children }: CardProps) => {
    // Determine the cursor style and accessibility properties when clickable.
    const isClickable = Boolean(onClick);
    const cursorStyle = isClickable ? "cursor-pointer" : "cursor-default";

    // Handle keyboard events for accessibility
    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (
        isClickable &&
        onClick &&
        (event.key === "Enter" || event.key === " ")
      ) {
        event.preventDefault();
        onClick();
      }
    };

    return isClickable ? (
      <button
        type="button"
        onClick={onClick}
        className={`${CARD_BASE_CLASS} ${cursorStyle} ${className} text-left w-full`}
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-center justify-between">
          <p className={CARD_TITLE_CLASS}>{title}</p>
          {icon && <div className="ml-2">{icon}</div>}
        </div>
        <p className={CARD_VALUE_CLASS}>{value}</p>
        {children && <div className="mt-4">{children}</div>}
      </button>
    ) : (
      <div className={`${CARD_BASE_CLASS} ${className}`}>
        <div className="flex items-center justify-between">
          <p className={CARD_TITLE_CLASS}>{title}</p>
          {icon && <div className="ml-2">{icon}</div>}
        </div>
        <p className={CARD_VALUE_CLASS}>{value}</p>
        {children && <div className="mt-4">{children}</div>}
      </div>
    );
  }
);

Card.displayName = "Card";
export default Card;
