"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Box, CircularProgress, Typography } from '@mui/material';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export default function ProtectedRoute({ 
  children, 
  requireAuth = true, 
  redirectTo = '/login' 
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [timeoutReached, setTimeoutReached] = useState(false);

  useEffect(() => {
    // Set a timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      setTimeoutReached(true);
    }, 5000); // 5 seconds timeout

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!loading || timeoutReached) {
      if (requireAuth && !user) {
        router.push(redirectTo);
      } else if (!requireAuth && user) {
        // If user is authenticated and this route doesn't require auth (like login/register)
        // redirect to dashboard
        router.push('/dashboard');
      }
    }
  }, [user, loading, requireAuth, redirectTo, router, timeoutReached]);

  if (loading && !timeoutReached) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 50%, #9CA3AF 100%)',
        }}
      >
        <CircularProgress size={60} sx={{ color: 'white', mb: 2 }} />
        <Typography variant="h6" sx={{ color: 'white', fontWeight: 500 }}>
          Loading...
        </Typography>
      </Box>
    );
  }

  // If timeout reached, show the content anyway
  if (timeoutReached) {
    return <>{children}</>;
  }

  // If route requires auth and user is not authenticated, don't render children
  if (requireAuth && !user) {
    return null;
  }

  // If route doesn't require auth and user is authenticated, don't render children
  if (!requireAuth && user) {
    return null;
  }

  return <>{children}</>;
} 