// src/app/admin/components/ViewButton.tsx
'use client';

import { FiEye } from 'react-icons/fi';

interface ViewButtonProps {
  onView: () => void;
}

export default function ViewButton({ onView }: ViewButtonProps) {
  return (
    <button
      onClick={onView}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200 flex items-center"
    >
      <FiEye className="h-5 w-5 mr-2" />
      <span>View</span>
    </button>
  );
}
