// src/app/admin/components/EditButton.tsx
'use client';

import Link from 'next/link';
import { HiPencil } from 'react-icons/hi';

interface EditButtonProps {
  href: string;
}

export default function EditButton({ href }: EditButtonProps) {
  return (
    <Link href={href}>
      <button className="bg-amber-500 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200 flex items-center">
        <HiPencil className="h-5 w-5 mr-2" />
        <span>Edit</span>
      </button>
    </Link>
  );
}
