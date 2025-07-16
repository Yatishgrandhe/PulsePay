"use client";

import { useState } from 'react';
import { Box, Button, Typography, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { supabase } from '@/utils/supabaseClient';

interface OAuthButtonsProps {
  mode: 'login' | 'register';
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function OAuthButtons({ mode, onSuccess, onError }: OAuthButtonsProps) {
  const [loading, setLoading] = useState(false);

  const handleGoogleAuth = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        console.error('OAuth error:', error);
        onError?.(error.message);
      } else {
        console.log('OAuth success:', data);
        onSuccess?.();
      }
    } catch (error) {
      console.error('OAuth error:', error);
      onError?.('Failed to authenticate with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: '100%', mt: 3 }}>
      <Typography 
        variant="body2" 
        sx={{ 
          textAlign: 'center', 
          mb: 2, 
          color: 'rgba(255,255,255,0.7)',
          position: 'relative',
          '&::before, &::after': {
            content: '""',
            position: 'absolute',
            top: '50%',
            width: '30%',
            height: '1px',
            background: 'rgba(255,255,255,0.2)',
          },
          '&::before': {
            left: 0,
          },
          '&::after': {
            right: 0,
          }
        }}
      >
        or continue with
      </Typography>
      
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button
          fullWidth
          variant="outlined"
          onClick={handleGoogleAuth}
          disabled={loading}
          sx={{
            py: 1.5,
            border: '2px solid rgba(255,255,255,0.3)',
            color: 'white',
            borderRadius: '12px',
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 600,
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(10px)',
            '&:hover': {
              border: '2px solid rgba(255,255,255,0.5)',
              background: 'rgba(255,255,255,0.1)',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
            },
            '&:disabled': {
              opacity: 0.6,
            }
          }}
        >
          {loading ? (
            <CircularProgress size={20} sx={{ color: 'white', mr: 1 }} />
          ) : (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              width: '100%',
              justifyContent: 'center'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <Typography sx={{ fontWeight: 600 }}>
                {loading ? 'Connecting...' : `Continue with Google`}
              </Typography>
            </Box>
          )}
        </Button>
      </motion.div>
      
      <Typography 
        variant="caption" 
        sx={{ 
          display: 'block', 
          textAlign: 'center', 
          mt: 2, 
          color: 'rgba(255,255,255,0.5)',
          fontSize: '0.75rem'
        }}
      >
        {mode === 'login' 
          ? "Don't have an account? " 
          : "Already have an account? "
        }
        <Box 
          component="span" 
          sx={{ 
            color: '#3B82F6', 
            cursor: 'pointer',
            textDecoration: 'underline',
            '&:hover': { color: '#60A5FA' }
          }}
        >
          {mode === 'login' ? 'Sign up' : 'Sign in'}
        </Box>
      </Typography>
    </Box>
  );
} 