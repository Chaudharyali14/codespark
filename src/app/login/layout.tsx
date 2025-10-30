'use client';

import { AuthProvider } from '../admin/context/AuthContext';

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
