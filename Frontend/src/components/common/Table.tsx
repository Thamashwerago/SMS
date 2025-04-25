import React, { useState, useMemo } from 'react';
import clsx from 'clsx';
import { ArrowUp, ArrowDown } from 'lucide-react';

/**
 * Column definition for CommonTable
 */
export interface Column<T> {
  /** Header label */
  header: string;
  /** Key of T or custom cell renderer */
  accessor: keyof T | ((row: T) => React.ReactNode);
  /** Optional custom cell render (overrides accessor) */
  Cell?: (row: T) => React.ReactNode;
  /** Optional sorting function for this column */
  sortFunction?: (a: T, b: T) => number;
}

/**
 * Props for CommonTable: generic over row type T
 */
export interface CommonTableProps<T extends { id: string | number }> {
  columns: Column<T>[];
  data: T[];
  initialSortColumn?: keyof T;
  initialSortDirection?: 'asc' | 'desc';
  onRowClick?: (row: T) => void;
  loading?: boolean;
  noDataMessage?: string;
}

const DEFAULT_SKELETON_ROWS = 5;

/**
 * Generic table component with sorting, loading skeleton, and no-data state.
 */
function CommonTable<T extends { id: string | number }>(
  {
    columns,
    data,
    initialSortColumn,
    initialSortDirection = 'asc',
    onRowClick,
    loading = false,
    noDataMessage = 'No records to display',
  }: Readonly<CommonTableProps<T>>
): React.ReactElement {
  const [sortColumn, setSortColumn] = useState<keyof T | null>(initialSortColumn ?? null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(initialSortDirection);

  const handleSort = (col: Column<T>) => {
    if (typeof col.accessor === 'function') return;
    const key = col.accessor;
    if (sortColumn === key) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(key);
      setSortDirection('asc');
    }
  };

  const sortedData = useMemo(() => {
    if (!sortColumn) return data;
    const colDef = columns.find((c) => c.sortFunction && c.accessor === sortColumn);
    const compare = colDef?.sortFunction ?? ((a: T, b: T) => {
      const aVal = a[sortColumn] as unknown as string | number;
      const bVal = b[sortColumn] as unknown as string | number;
      if (aVal < bVal) {
        return -1;
      } else if (aVal > bVal) {
        return 1;
      } else {
        return 0;
      }
    });
    return [...data].sort((a, b) => (sortDirection === 'asc' ? compare(a, b) : -compare(a, b)));
  }, [data, sortColumn, sortDirection, columns]);

  // Loading skeleton
  if (loading) {
    const skeletonRows = Array.from({ length: DEFAULT_SKELETON_ROWS }, (_, i) => i);
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.header} className="px-6 py-3 bg-gray-800">
                  <div className="h-4 bg-gray-700 rounded w-24 animate-pulse" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {skeletonRows.map((idx) => (
              <tr key={idx} className="bg-black">
                {columns.map((col) => (
                  <td key={col.header} className="px-6 py-4">
                    <div className="h-4 bg-gray-700 rounded animate-pulse" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // No data state
  if (sortedData.length === 0) {
    return <div className="py-8 text-center text-gray-500">{noDataMessage}</div>;
  }

  return (
    <div className="overflow-x-auto shadow rounded-lg">
      <table className="min-w-full table-auto text-sm divide-y divide-gray-700">
        <thead className="bg-gray-800 sticky top-0 z-10">
          <tr>
            {columns.map((col) => {
              const key =
                typeof col.accessor === "function" ? col.header : col.accessor;
              const isActive = key === sortColumn;
              return (
                <th
                  key={col.header}
                  onClick={() => handleSort(col)}
                  scope="col"
                  className={clsx(
                    "px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider cursor-pointer select-none",
                    isActive ? "bg-gray-700" : "hover:bg-gray-700",
                    "focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  )}
                >
                  <div className="flex items-center">
                    <span>{col.header}</span>
                    {isActive && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? (
                          <ArrowUp size={12} />
                        ) : (
                          <ArrowDown size={12} />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="bg-black divide-y divide-gray-800">
          {sortedData.map((row) => (
            <tr
              key={row.id}
              onClick={() => onRowClick?.(row)}
              className={clsx(
                "transition-colors cursor-pointer",
                "odd:bg-black even:bg-gray-900",
                onRowClick
                  ? "focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  : ""
              )}
              tabIndex={onRowClick ? 0 : -1}
            >
              {columns.map((col) => {
                // Extract the nested ternary into a separate variable
                const accessorValue =
                  typeof col.accessor === "function"
                    ? col.accessor(row)
                    : String(row[col.accessor] ?? "");

                const content = col.Cell ? col.Cell(row) : accessorValue;
                return (
                  <td
                    key={`${row.id}-${col.header}`}
                    className="px-6 py-4 max-w-xs truncate text-white"
                    title={typeof content === "string" ? content : undefined}
                  >
                    {content}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default React.memo(CommonTable) as <T extends { id: string | number }>(
  props: CommonTableProps<T>
) => React.ReactElement;
