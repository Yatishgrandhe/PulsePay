"use client";

import { useState } from "react";
import { 
  Box, 
  Container, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Link as MuiLink,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton
} from "@mui/material";
import { 
  Email, 
  Lock, 
  Visibility, 
  VisibilityOff,
  CheckCircle,
  Error
} from "@mui/icons-material";
import { motion } from "framer-motion";
import Link from "next/link";
import { supabase } from "@/utils/supabaseClient";
import Logo from "@/components/Logo";
import OAuthButtons from "@/components/OAuthButtons";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        setError(error.message);
      } else {
        // Redirect to dashboard on success
        window.location.href = '/dashboard';
      }
    } catch {
      setError('An error occurred during sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email || !supabase) return;
    
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess("Magic link sent! Check your email.");
      }
    } catch {
      setError('An error occurred while sending reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute requireAuth={false}>
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #1E3A8A 0%, #3B82F6 50%, #9CA3AF 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 4,
          px: 2
        }}
      >
        <Container maxWidth="sm">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Paper
              elevation={24}
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 4,
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                position: "relative",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "4px",
                  background: "linear-gradient(90deg, #1E3A8A, #3B82F6, #9CA3AF)",
                  borderRadius: "4px 4px 0 0"
                }
              }}
            >
              {/* Logo and Header */}
              <Box sx={{ textAlign: "center", mb: 4 }}>
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Link href="/" passHref>
                    <Box sx={{ cursor: "pointer", display: "inline-block" }}>
                      <Logo size={60} variant="compact" showText={false} />
                    </Box>
                  </Link>
                </motion.div>
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{
                    fontWeight: 700,
                    background: "linear-gradient(90deg, #1E3A8A, #3B82F6)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    mt: 2,
                    mb: 1
                  }}
                >
                  Welcome Back
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Sign in to your Health AI account
                </Typography>
              </Box>

              {/* Success/Error Messages */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Alert 
                    severity="error" 
                    icon={<Error />}
                    sx={{ mb: 3, borderRadius: 2 }}
                  >
                    {error}
                  </Alert>
                </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Alert 
                    severity="success" 
                    icon={<CheckCircle />}
                    sx={{ mb: 3, borderRadius: 2 }}
                  >
                    {success}
                  </Alert>
                </motion.div>
              )}

              {/* Login Form */}
              <Box
                component="form"
                onSubmit={handleLogin}
                sx={{ display: "flex", flexDirection: "column", gap: 3 }}
              >
                <TextField
                  fullWidth
                  label="Email Address"
            type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
            required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: "primary.main" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "primary.main",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "primary.main",
                        borderWidth: 2,
                      },
                    },
                  }}
          />

                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
            required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: "primary.main" }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ color: "primary.main" }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "primary.main",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "primary.main",
                        borderWidth: 2,
                      },
                    },
                  }}
                />

                {/* Forgot Password Link */}
                <Box sx={{ textAlign: "right" }}>
                  <Link href="/forgot-password" passHref>
                    <MuiLink
                      component="span"
                      sx={{
                        color: "primary.main",
                        textDecoration: "none",
                        fontWeight: 500,
                        fontSize: "0.9rem",
                        "&:hover": {
                          textDecoration: "underline"
                        }
                      }}
                    >
                      Forgot password?
                    </MuiLink>
                  </Link>
                </Box>

                {/* Login Button */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
            type="submit"
                    fullWidth
                    variant="contained"
                    disabled={loading || !email || !password}
                    sx={{
                      py: 1.5,
                      borderRadius: 3,
                      background: "linear-gradient(90deg, #1E3A8A, #3B82F6)",
                      fontSize: "1.1rem",
                      fontWeight: 600,
                      textTransform: "none",
                      boxShadow: "0 8px 32px rgba(30, 58, 138, 0.3)",
                      "&:hover": {
                        background: "linear-gradient(90deg, #1E40AF, #2563EB)",
                        boxShadow: "0 12px 40px rgba(30, 58, 138, 0.4)",
                        transform: "translateY(-2px)",
                      },
                      "&:disabled": {
                        background: "rgba(0, 0, 0, 0.12)",
                        color: "rgba(0, 0, 0, 0.38)",
                      },
                    }}
          >
                    {loading ? (
                      <CircularProgress size={24} sx={{ color: "white" }} />
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </motion.div>

                {/* Magic Link Button */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    fullWidth
                    variant="outlined"
          onClick={handleForgotPassword}
          disabled={loading || !email}
                    sx={{
                      py: 1.5,
                      borderRadius: 3,
                      borderColor: "primary.main",
                      color: "primary.main",
                      fontSize: "1rem",
                      fontWeight: 500,
                      textTransform: "none",
                      "&:hover": {
                        borderColor: "primary.dark",
                        background: "rgba(30, 58, 138, 0.05)",
                        transform: "translateY(-1px)",
                      },
                      "&:disabled": {
                        borderColor: "rgba(0, 0, 0, 0.12)",
                        color: "rgba(0, 0, 0, 0.38)",
                      },
                    }}
        >
                    {loading ? "Sending..." : "Sign in with Magic Link"}
                  </Button>
                </motion.div>
              </Box>

              {/* OAuth Buttons */}
              <OAuthButtons 
                mode="login"
                onSuccess={() => {
                  setSuccess("Google authentication successful! Redirecting...");
                  setTimeout(() => {
                    window.location.href = "/dashboard";
                  }, 1500);
                }}
                onError={(error) => setError(error)}
              />

              {/* Sign Up Link */}
              <Box sx={{ textAlign: "center", pt: 2, borderTop: "1px solid rgba(0, 0, 0, 0.1)" }}>
                <Typography variant="body2" color="text.secondary">
                  Don&apos;t have an account?{" "}
                  <Link href="/register" passHref>
                    <MuiLink
                      component="span"
                      sx={{
                        color: "primary.main",
                        fontWeight: 600,
                        textDecoration: "none",
                        "&:hover": {
                          textDecoration: "underline"
                        }
                      }}
                    >
                      Sign up here
                    </MuiLink>
                  </Link>
                </Typography>
              </Box>
            </Paper>
          </motion.div>
        </Container>
      </Box>
    </ProtectedRoute>
  );
} 