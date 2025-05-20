
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { VideoProvider } from "@/contexts/VideoContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import StudentDashboard from "@/pages/StudentDashboard";
import TeacherDashboard from "@/pages/TeacherDashboard";
import VideoForm from "@/pages/VideoForm";
import VideoDetail from "@/pages/VideoDetail";
import NotFound from "./pages/NotFound";
import { useAuth } from "@/contexts/AuthContext";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { authState } = useAuth();
  
  // Redirect based on user role
  const renderHome = () => {
    if (!authState.isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    
    if (authState.user?.role === 'professor') {
      return <Navigate to="/admin" replace />;
    }
    
    return <StudentDashboard />;
  };

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Home route - redirect based on role */}
      <Route path="/" element={renderHome()} />
      
      {/* Student routes */}
      <Route 
        path="/videos/:id" 
        element={
          <ProtectedRoute>
            <VideoDetail />
          </ProtectedRoute>
        } 
      />
      
      {/* Teacher routes */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute allowedRoles={['professor']}>
            <TeacherDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/videos/:id" 
        element={
          <ProtectedRoute allowedRoles={['professor']}>
            <VideoForm />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/videos/edit/:id" 
        element={
          <ProtectedRoute allowedRoles={['professor']}>
            <VideoForm />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/videos/new" 
        element={
          <ProtectedRoute allowedRoles={['professor']}>
            <VideoForm />
          </ProtectedRoute>
        } 
      />
      
      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <VideoProvider>
          <BrowserRouter>
            <AppRoutes />
            <Toaster />
            <Sonner />
          </BrowserRouter>
        </VideoProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
