
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import StudentDashboard from './StudentDashboard';

const Index = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authState.isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (authState.user?.role === 'professor') {
      navigate('/admin');
    }
  }, [authState, navigate]);

  // For students, show the student dashboard
  return <StudentDashboard />;
};

export default Index;
