// src/app/admin/components/AdminHeader.tsx
'use client';

import Link from 'next/link';

interface AdminHeaderProps {
  title: string;
  addHref: string;
  onExport?: () => void;
}

export default function AdminHeader({ title, addHref, onExport }: AdminHeaderProps) {
  return (
    // Responsive header: items will wrap on smaller screens
    <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
      {/* Responsive title */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800">{title}</h1>
      <div className="flex gap-2">
        {onExport && (
          <button
            onClick={onExport}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200 text-sm sm:text-base"
          >
            Export to Excel
          </button>
        )}
        {addHref && (
          <Link href={addHref}>
            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200 text-sm sm:text-base">
              Add New
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}
