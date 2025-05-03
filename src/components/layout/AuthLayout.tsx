
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const { user, loading } = useAuth();
  
  // Show loading indicator while auth state is being determined
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
        <div className="animate-pulse flex flex-col items-center backdrop-blur-sm bg-white/30 p-8 rounded-2xl shadow-xl border border-white/20">
          <div className="h-12 w-12 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-gradient-to-r from-purple-300 to-indigo-300 rounded"></div>
        </div>
      </div>
    );
  }
  
  // User is authenticated, show sidebar layout
  if (user) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    );
  }
  
  // User is not authenticated, show content without sidebar
  return <>{children}</>;
};

export default AuthLayout;
