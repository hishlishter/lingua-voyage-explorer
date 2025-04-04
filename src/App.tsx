
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Settings from "./pages/Settings";
import Courses from "./pages/Courses";
import Dictionary from "./pages/Dictionary";
import Tests from "./pages/Tests";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import { AuthProvider, useAuth } from "./context/AuthContext";
import TestDetail from "./pages/TestDetail";
import { Skeleton } from "./components/ui/skeleton";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// A more responsive loading indicator
const LoadingScreen = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="flex flex-col items-center gap-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <Skeleton className="h-4 w-32" />
      <p className="text-sm text-muted-foreground animate-pulse">Загрузка...</p>
    </div>
  </div>
);

// Simplified protected route with better error handling
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  console.log("ProtectedRoute - loading:", loading, "user:", user?.id);
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  if (!user) {
    console.log("No user, redirecting to /auth");
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  const { user, loading } = useAuth();
  
  console.log("AppRoutes - loading:", loading, "user:", user?.id);
  
  // Add a maximum waiting time for loading - if it takes too long, assume there's an issue
  React.useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;
    
    if (loading) {
      timeout = setTimeout(() => {
        console.log("Loading timeout reached - possible auth issue");
      }, 5000);  // 5 seconds timeout
    }
    
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [loading]);
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/settings" element={
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      } />
      <Route path="/courses" element={
        <ProtectedRoute>
          <Courses />
        </ProtectedRoute>
      } />
      <Route path="/dictionary" element={
        <ProtectedRoute>
          <Dictionary />
        </ProtectedRoute>
      } />
      <Route path="/tests" element={
        <ProtectedRoute>
          <Tests />
        </ProtectedRoute>
      } />
      <Route path="/tests/:id" element={
        <ProtectedRoute>
          <TestDetail />
        </ProtectedRoute>
      } />
      <Route path="/auth" element={user ? <Navigate to="/" /> : <Auth />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  console.log("App component rendering");
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
