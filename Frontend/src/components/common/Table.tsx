// src/components/common/CommonTable.tsx
import React, { useState, useMemo } from 'react';

/**
 * Column interface for CommonTable.
 * - header: The column header label.
 * - accessor: A key of T or a function to retrieve cell data.
 * - Cell (optional): Custom cell renderer function.
 * - sortFunction (optional): Custom function for sorting this column.
 */
export interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  Cell?: (row: T) => React.ReactNode;
  sortFunction?: (a: T, b: T) => number;
}

/**
 * Props for CommonTable component.
 * - columns: Array of column definitions.
 * - data: Array of data objects to display.
 * - initialSortColumn (optional): The key of T to initially sort by.
 * - initialSortDirection (optional): The initial sort direction, defaulting to "asc".
 * - onRowClick (optional): Callback function when a row is clicked.
 */
interface CommonTableProps<T> {
  columns: Column<T>[];
  data: T[];
  initialSortColumn?: keyof T;
  initialSortDirection?: 'asc' | 'desc';
  onRowClick?: (row: T) => void;
}

/**
 * CommonTable Component
 * -----------------------
 * A reusable table component that displays data based on given column definitions.
 * It supports sorting, optional row click callbacks, and a responsive design using Tailwind CSS.
 *
 * @param {CommonTableProps<T>} props - The properties for configuring the table.
 * @returns A JSX element representing the table.
 */
const CommonTable = <T extends { id: string | number }>({
  columns,
  data,
  initialSortColumn,
  initialSortDirection = 'asc',
  onRowClick,
}: CommonTableProps<T>): React.ReactElement => {
  // State for sorting: which column and direction.
  const [sortColumn, setSortColumn] = useState<keyof T | null>(initialSortColumn ?? null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(initialSortDirection);

  /**
   * handleSort - Called when a table header is clicked.
   * Toggles sorting direction if the same column is clicked again.
   * @param col - The column being sorted.
   */
  const handleSort = (col: Column<T>) => {
    let columnKey: keyof T | null = null;
    if (typeof col.accessor !== 'function') {
      columnKey = col.accessor;
    }
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  /**
   * sortedData - Returns a sorted copy of the data array based on the active sort column and direction.
   */
  const sortedData = useMemo(() => {
    if (!sortColumn) return data;
    // Find column definition for the active sort column.
    const colDef = columns.find(
      (col) => typeof col.accessor !== 'function' && col.accessor === sortColumn
    );
    if (colDef?.sortFunction) {
      return [...data].sort((a, b) => {
        const result = colDef.sortFunction!(a, b);
        return sortDirection === 'asc' ? result : -result;
      });
    } else {
      return [...data].sort((a, b) => {
        const aValue = (a[sortColumn] as string | number | Date | boolean | undefined) ?? "";
        const bValue = (b[sortColumn] as string | number | Date | boolean | undefined) ?? "";
        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }
  }, [data, sortColumn, sortDirection, columns]);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-800">
          <tr>
            {columns.map((col) => (
              <th
                key={`header-${col.header}`}
                onClick={() => handleSort(col)}
                className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider cursor-pointer select-none"
              >
                {col.header}
                {sortColumn &&
                  typeof col.accessor !== 'function' &&
                  col.accessor === sortColumn && (
                    <span className="ml-2">{sortDirection === 'asc' ? '▲' : '▼'}</span>
                  )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-black divide-y divide-gray-800">
          {sortedData.map((row) => (
            <tr
              key={row.id}
              onClick={() => onRowClick && onRowClick(row)}
              className="hover:bg-gray-700 transition-colors cursor-pointer"
            >
              {columns.map((col) => {
                let cellContent;
                if (col.Cell) {
                  cellContent = col.Cell(row);
                } else if (typeof col.accessor === 'function') {
                  cellContent = col.accessor(row);
                } else {
                  cellContent = String(row[col.accessor] ?? '');
                }
                return (
                  <td key={`cell-${row.id}-${col.header}`} className="px-6 py-4 whitespace-nowrap text-white">
                    {cellContent}
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

export default CommonTable;
