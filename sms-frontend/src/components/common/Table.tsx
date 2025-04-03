// src/components/Table.tsx

import React, { JSX } from "react";

// Define a generic Column interface to describe each table column.
// The accessor can be a key of the data type T or a function returning a React node.
export interface Column<T> {
  header: string; // Column header text
  accessor: keyof T | ((row: T) => React.ReactNode); // Key or render function to get cell data
  className?: string; // Optional custom classes for this column's header
}

// Define the properties expected by the Table component using a generic type T.
export interface TableProps<T> {
  columns: Column<T>[]; // Array of column definitions
  data: T[]; // Array of data objects to render as rows
  className?: string; // Optional custom classes for the table container
}

/**
 * Futuristic Table Component
 *
 * This component renders a responsive and modern-styled table.
 * It leverages Tailwind CSS for styling and is built with TypeScript for strong type safety.
 *
 * Security & Accessibility Considerations:
 * - Uses semantic HTML elements (<table>, <thead>, <tbody>, <tr>, <th>, and <td>) for better screen reader compatibility.
 * - TypeScript generics ensure that the table data and column configurations are type-safe.
 * - Additional props can be passed (e.g., aria attributes) to enhance accessibility.
 *
 * @param {TableProps<T>} props - Props including columns and data to display.
 * @returns {JSX.Element} A styled, accessible table.
 */
const Table = <T extends { rowKey: string }>({ columns, data, className }: TableProps<T>): JSX.Element => {
  return (
    <div className={`overflow-x-auto ${className ?? ""}`}>
      <table className="min-w-full bg-gray-800 text-white">
        {/* Table header */}
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.header}
                className={`px-4 py-2 border-b border-gray-600 text-left font-semibold ${column.className ?? ""}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        {/* Table body */}
        <tbody>
          {data.map((row) => (
            <tr key={row.rowKey} className="hover:bg-gray-700 transition-colors">
              {columns.map((column) => {
                // Determine cell content using the accessor, which can be a function or a property key.
                const cellContent =
                  typeof column.accessor === "function"
                    ? column.accessor(row)
                    : row[column.accessor];
                return (
                  <td key={`${row.rowKey}-${column.header}`} className="px-4 py-2 border-b border-gray-600">
                    {cellContent as React.ReactNode}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
