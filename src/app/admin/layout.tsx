'use client';

import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import { FiMenu } from 'react-icons/fi';
import { useState } from 'react';

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!isLoggedIn) {
    return null; // or a loading spinner
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 p-4 sm:p-6 md:p-10">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-gray-800">Welcome, Admin!</h1>
            <p className="mt-1 md:mt-2 text-sm md:text-base text-gray-600">Here&apos;s what&apos;s happening with your application today.</p>
          </div>
          <button
            className="md:hidden p-2 rounded-md text-gray-500 hover:bg-gray-200"
            onClick={() => setIsSidebarOpen(true)}
          >
            <FiMenu size={24} />
          </button>
        </header>
        <main>
          {children}
        </main>
      </div>
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black opacity-50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AuthProvider>
  );
}