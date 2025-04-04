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

const queryClient = new QueryClient();

// Модифицированный защищенный маршрут с более информативным состоянием загрузки
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-4 w-32" />
          <p className="text-sm text-muted-foreground animate-pulse">Загрузка...</p>
        </div>
      </div>
    );
  }
  
  // Без редиректа, просто рендерим дочерние компоненты
  return <>{children}</>;
};

const AppRoutes = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-4 w-32" />
          <p className="text-sm text-muted-foreground animate-pulse">Загрузка...</p>
        </div>
      </div>
    );
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

const App = () => (
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

export default App;
