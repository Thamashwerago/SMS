// src/components/common/Table.tsx
import React, { memo, useMemo } from 'react';

export interface Column<T> {
  /** Header text for the column */
  header: string;
  /**
   * Accessor to retrieve the cell's data from the row.
   * Can be a key of the row object or a function that returns a ReactNode.
   */
  accessor: keyof T | ((row: T) => React.ReactNode);
  /** Optional custom header class */
  headerClassName?: string;
  /** Optional custom cell class */
  cellClassName?: string;
}

export interface TableProps<T> {
  /** Data array of type T */
  data: T[];
  /** Array of column definitions */
  columns: Column<T>[];
  /** Field to be used as a unique key for each row */
  keyField: keyof T;
  /** Optional table wrapper className */
  tableClassName?: string;
}

const Table = <T extends object>({
  data,
  columns,
  keyField,
  tableClassName = 'min-w-full border border-collapse',
}: TableProps<T>) => {
  // Memoize the rendered rows to avoid unnecessary re-renders.
  const renderedRows = useMemo(
    () =>
      data.map((row) => (
        <tr key={String(row[keyField])} className="hover:bg-gray-700 transition-colors">
          {columns.map((col, index) => {
            let cellContent: React.ReactNode;
            if (typeof col.accessor === 'function') {
              cellContent = col.accessor(row);
            } else {
              const value = row[col.accessor];
              cellContent =
                typeof value === 'object' && value !== null ? JSON.stringify(value) : String(value) || '-';
            }
            return (
              <td key={`${String(keyField)}-${index}`} className={`border p-2 ${col.cellClassName ?? ''}`}>
                {cellContent}
              </td>
            );
          })}
        </tr>
      )),
    [data, columns, keyField]
  );

  return (
    <div className="overflow-x-auto">
      <table className={tableClassName}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.header} className={`border p-2 bg-gray-200 text-left ${col.headerClassName ?? ''}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{renderedRows}</tbody>
      </table>
    </div>
  );
};

export default memo(Table) as typeof Table;
