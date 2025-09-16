// src/components/ProtectedRoute.jsx - Protect routes that require authentication
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = checking, true/false = result
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      // First, check if we have a token
      if (!api.isAuthenticated()) {
        setIsAuthenticated(false);
        setIsLoading(false);
        navigate('/login');
        return;
      }

      // We have a token, but let's verify it's valid by calling a protected endpoint
      try {
        const result = await api.dashboard();
        if (result.success) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          navigate('/login');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
        navigate('/login');
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, [navigate]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If authenticated, render the protected component
  if (isAuthenticated) {
    return children;
  }

  // If not authenticated, don't render anything (navigation handled above)
  return null;
};

export default ProtectedRoute;