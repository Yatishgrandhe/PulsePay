"use client";

import { useState } from 'react';
import { Button, Box, Typography } from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';
import { supabase } from '@/utils/supabaseClient';

interface OAuthButtonsProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function OAuthButtons({ onSuccess, onError }: OAuthButtonsProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    if (!supabase) return;
    
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        setError(error.message);
        onError?.(error.message);
      } else {
        onSuccess?.();
      }
    } catch {
      const errorMsg = 'An error occurred during sign in';
      setError(errorMsg);
      onError?.(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      {error && (
        <Typography color="error" variant="body2" sx={{ mb: 2, textAlign: 'center' }}>
          {error}
        </Typography>
      )}
      
      <Button
        fullWidth
        variant="outlined"
        onClick={handleGoogleSignIn}
        disabled={loading}
        startIcon={<GoogleIcon />}
        sx={{
          mb: 2,
          py: 1.5,
          borderColor: 'rgba(255, 255, 255, 0.3)',
          color: 'white',
          '&:hover': {
            borderColor: 'rgba(255, 255, 255, 0.5)',
            backgroundColor: 'rgba(255, 255, 255, 0.1)'
          }
        }}
      >
        {loading ? 'Signing in...' : 'Continue with Google'}
      </Button>
    </Box>
  );
} 