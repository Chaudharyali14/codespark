// src/app/admin/components/AdminTable.tsx
'use client';

import EditButton from './EditButton';
import DeleteButton from './DeleteButton';

import ViewButton from './ViewButton';

interface DataItem {
  id: number;
  [key: string]: string | number | undefined | React.ReactElement;
}

interface AdminTableProps {
  columns: string[];
  data: DataItem[];
  editHrefBase: string;
  onDelete: (id: number) => void;
  onView?: (item: DataItem) => void;
}

export default function AdminTable({ columns, data, editHrefBase, onDelete, onView }: AdminTableProps) {
  return (
    // Responsive container; table becomes horizontally scrollable on smaller screens
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-8 overflow-x-auto">
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            {columns.map((col) => (
              <th key={col} className="py-3 px-6 text-left">
                {col}
              </th>
            ))}
            <th className="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>

        <tbody className="text-gray-600 text-sm font-light">
          {data.map((item) => (
            <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-100">
              {columns.map((col) => {
                const value = item[col.toLowerCase()];
                const stringValue = value !== undefined ? String(value) : ''; // ✅ convert to string safely

                return (
                  <td key={`${item.id}-${col}`} className="py-3 px-6 text-left whitespace-nowrap">
                    {/* Truncate long text and show tooltip on hover */}
                    <span title={stringValue} className="block max-w-xs truncate">
                      {stringValue}
                    </span>
                  </td>
                );
              })}

              <td className="py-3 px-6 text-center">
                <div className="flex items-center justify-center">
                  {onView && <ViewButton onView={() => onView(item)} />}
                  <EditButton href={`${editHrefBase}/${item.id}`} />
                  <DeleteButton onDelete={() => onDelete(item.id)} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
