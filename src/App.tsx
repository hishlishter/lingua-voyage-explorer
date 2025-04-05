
import { Toaster as ShadcnToaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Settings from "./pages/Settings";
import Lessons from "./pages/Lessons"; // Changed from Courses
import LessonDetail from "./pages/LessonDetail"; // Changed from CourseDetail
import Dictionary from "./pages/Dictionary";
import Tests from "./pages/Tests";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TooltipProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/lessons" element={<Lessons />} /> {/* Changed from /courses */}
            <Route path="/lessons/:id" element={<LessonDetail />} /> {/* Changed from /courses/:id */}
            <Route path="/dictionary" element={<Dictionary />} />
            <Route path="/tests" element={<Tests />} />
            <Route path="/tests/:id" element={<TestDetail />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ShadcnToaster />
          <Sonner />
        </AuthProvider>
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
