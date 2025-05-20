import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useQuery } from 'react-query';

// Pages
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import InstallerView from './pages/InstallerView';
import NotFound from './pages/NotFound';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';

// Auth utils
import { checkAuthStatus } from './utils/auth';

// App component

function App() {
  const [isLoading, setIsLoading] = useState(true);
  
  // Check authentication status on app load
  const { data: isAuthenticated, isLoading: authLoading } = useQuery(
    'authStatus',
    checkAuthStatus,
    {
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    }
  );

  useEffect(() => {
    // Set loading state based on auth check
    if (!authLoading) {
      setIsLoading(false);
    }
  }, [authLoading]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={isAuthenticated ? <Navigate to="/admin/dashboard" /> : <AdminLogin />} />
        <Route path="/installer/:siteId" element={<InstallerView />} />
        
        {/* Protected Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute isAuthenticated={!!isAuthenticated} />}>
          <Route path="dashboard" element={<AdminDashboard />} />
        </Route>
        
        {/* Redirect root to appropriate page based on auth status */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/admin/dashboard" /> : <Navigate to="/login" />} />
        
        {/* 404 Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
