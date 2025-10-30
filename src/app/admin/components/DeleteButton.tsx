// src/app/admin/components/DeleteButton.tsx
'use client';

import { HiTrash } from 'react-icons/hi';

interface DeleteButtonProps {
  onDelete: () => void;
}

export default function DeleteButton({ onDelete }: DeleteButtonProps) {
  const handleClick = () => {
    if (confirm('Are you sure you want to delete this item?')) {
      onDelete();
    }
  };

  return (
    <button
      onClick={handleClick}
      className="bg-rose-500 hover:bg-rose-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200 ml-2 flex items-center"
    >
      <HiTrash className="h-5 w-5 mr-2" />
      <span>Delete</span>
    </button>
  );
}
