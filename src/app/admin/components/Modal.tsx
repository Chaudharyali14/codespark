
'use client';

import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    // The modal is positioned fixed to cover the screen with a semi-transparent background.
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" role="dialog">
      {/* The modal container is responsive, with a max-width and vertical scroll for long content. */}
      <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8 max-w-2xl w-full max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h2 className="text-xl sm:text-2xl font-bold">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-3xl">&times;</button>
        </div>
        {/* The modal content is scrollable if it overflows. */}
        <div className="overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
