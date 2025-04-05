
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
import { AuthProvider } from "./context/AuthContext";
import TestDetail from "./pages/TestDetail";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30000,
    },
  },
});

// Modified protected route that doesn't show loading
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // Always render children without loading checks
  return <>{children}</>;
};

const AppRoutes = () => {
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
      <Route path="/auth" element={<Auth />} />
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
