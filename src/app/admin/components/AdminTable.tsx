// src/app/admin/components/AdminTable.tsx
'use client';

import EditButton from './EditButton';
import DeleteButton from './DeleteButton';

interface DataItem {
  id: number;
  [key: string]: string | number;
}

interface AdminTableProps {
  columns: string[];
  data: DataItem[];
  editHrefBase: string;
  onDelete: (id: number) => void;
}

export default function AdminTable({ columns, data, editHrefBase, onDelete }: AdminTableProps) {
  return (
    // The container is responsive. On smaller screens, the table will overflow and become horizontally scrollable.
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-8 overflow-x-auto">
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            {columns.map((col) => (
              <th key={col} className="py-3 px-6 text-left">{col}</th>
            ))}
            <th className="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {data.map((item) => (
            <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-100">
              {columns.map((col) => (
                <td key={`${item.id}-${col}`} className="py-3 px-6 text-left whitespace-nowrap">
                  {/* Truncate long text and show tooltip on hover */}
                  <span title={item[col.toLowerCase()]} className="block max-w-xs truncate">
                    {item[col.toLowerCase()]}
                  </span>
                </td>
              ))}
              <td className="py-3 px-6 text-center">
                <div className="flex item-center justify-center">
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
