
import { Toaster as ShadcnToaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Settings from "./pages/Settings";
import Lessons from "./pages/Lessons"; 
import LessonDetail from "./pages/LessonDetail";
import Dictionary from "./pages/Dictionary";
import Tests from "./pages/Tests";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import TestDetail from "./pages/TestDetail";
import { AuthProvider } from "./context/AuthContext";
import { useEffect } from "react";
import { initializeGrammarLessons } from "./lib/supabase-lessons";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30000,
    },
  },
});

const AppRoutes = () => {
  useEffect(() => {
    const setupLessons = async () => {
      try {
        await initializeGrammarLessons();
      } catch (error) {
        console.error("Error initializing grammar lessons:", error);
      }
    };
    
    setupLessons();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/lessons" element={<Lessons />} /> 
      <Route path="/lessons/:id" element={<LessonDetail />} /> 
      <Route path="/dictionary" element={<Dictionary />} />
      <Route path="/tests" element={<Tests />} />
      <Route path="/tests/:id" element={<TestDetail />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TooltipProvider>
        <AuthProvider>
          <AppRoutes />
          <ShadcnToaster />
          <Sonner />
        </AuthProvider>
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
