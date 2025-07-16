"use client";

import { useState, useEffect } from "react";
import { 
  Box, 
  Container, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Alert,
  CircularProgress,
  Avatar,
  Card,
  CardContent,
  Chip,
  Divider,
  InputAdornment
} from "@mui/material";
import { 
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Security as SecurityIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";
import AnimatedLogo from "@/components/AnimatedLogo";
import Link from "next/link";

interface ProfileData {
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  emergencyContact: string;
}

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [user, setUser] = useState<{ id: string; email?: string; user_metadata?: Record<string, unknown> } | null>(null);
  const [profile, setProfile] = useState<ProfileData>({
    fullName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    emergencyContact: ''
  });
  const [originalProfile, setOriginalProfile] = useState<ProfileData>({
    fullName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    emergencyContact: ''
  });
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!supabase) return;
      
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login');
          return;
        }

        setUser(user);

        // Fetch user profile from database
        const { data: profileData } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileData) {
          const profileInfo: ProfileData = {
            fullName: profileData.full_name || user.user_metadata?.full_name || '',
            email: user.email || '',
            phoneNumber: profileData.phone_number || '',
            dateOfBirth: profileData.date_of_birth || '',
            emergencyContact: profileData.emergency_contact || ''
          };
          
          setProfile(profileInfo);
          setOriginalProfile(profileInfo);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
    setError(null);
  };

  const handleSave = async () => {
    if (!user || !supabase) return;

    setSaving(true);
    setError(null);

    try {
      // Update user metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          full_name: profile.fullName
        }
      });

      if (authError) throw authError;

      // Update profile in database
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({
          full_name: profile.fullName,
          phone_number: profile.phoneNumber,
          date_of_birth: profile.dateOfBirth,
          emergency_contact: profile.emergencyContact
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      setOriginalProfile(profile);
      setEditing(false);
      setSuccess('Profile updated successfully!');
      
      setTimeout(() => setSuccess(null), 3000);

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setProfile(originalProfile);
    setEditing(false);
    setError(null);
  };

  const handleEdit = () => {
    setEditing(true);
    setError(null);
    setSuccess(null);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        py: 4,
        px: 2
      }}
    >
      <Container maxWidth="md">
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
                background: "linear-gradient(90deg, #E573B7, #7B61FF, #FFD166)",
                borderRadius: "4px 4px 0 0"
              }
            }}
          >
            {/* Header */}
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Link href="/" passHref>
                  <Box sx={{ cursor: "pointer", display: "inline-block" }}>
                    <AnimatedLogo size={60} variant="compact" showWhiteCircle={false} />
                  </Box>
                </Link>
              </motion.div>
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 700,
                  background: "linear-gradient(90deg, #E573B7, #7B61FF)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mt: 2,
                  mb: 1
                }}
              >
                Profile Settings
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Manage your account information and preferences
              </Typography>
            </Box>

            {/* Error/Success Messages */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Alert 
                  severity="error" 
                  icon={<ErrorIcon />}
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
                  icon={<CheckCircleIcon />}
                  sx={{ mb: 3, borderRadius: 2 }}
                >
                  {success}
                </Alert>
              </motion.div>
            )}

            {/* Profile Avatar */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  mx: 'auto',
                  mb: 2,
                  background: 'linear-gradient(135deg, #E573B7, #7B61FF)',
                  fontSize: '3rem'
                }}
              >
                {profile.fullName ? profile.fullName.charAt(0).toUpperCase() : 'U'}
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                {profile.fullName || 'User'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {profile.email}
              </Typography>
            </Box>

            {/* Profile Form */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                  <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Personal Information
                </Typography>
                {!editing ? (
                  <Button
                    startIcon={<EditIcon />}
                    onClick={handleEdit}
                    variant="outlined"
                    sx={{ borderRadius: 2 }}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      startIcon={<CancelIcon />}
                      onClick={handleCancel}
                      variant="outlined"
                      sx={{ borderRadius: 2 }}
                    >
                      Cancel
                    </Button>
                    <Button
                      startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                      onClick={handleSave}
                      disabled={saving}
                      variant="contained"
                      sx={{
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #E573B7, #7B61FF)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #D563A7, #6B51EF)',
                        }
                      }}
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </Box>
                )}
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 3 }}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={profile.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  disabled={!editing}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: "primary.main" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
                <TextField
                  fullWidth
                  label="Email"
                  value={profile.email}
                  disabled
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: "primary.main" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={profile.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  disabled={!editing}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon sx={{ color: "primary.main" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
                <TextField
                  fullWidth
                  label="Date of Birth"
                  type="date"
                  value={profile.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  disabled={!editing}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
                <TextField
                  fullWidth
                  label="Emergency Contact"
                  value={profile.emergencyContact}
                  onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                  disabled={!editing}
                  placeholder="Name and phone number of emergency contact"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
              </Box>
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* Account Status */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main', mb: 3 }}>
                <SecurityIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Account Status
              </Typography>
              
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
                <Card sx={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(20px)' }}>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                      Email Verification
                    </Typography>
                    <Chip 
                      label={user?.user_metadata?.email_confirmed_at ? "Verified" : "Pending"} 
                      color={user?.user_metadata?.email_confirmed_at ? "success" : "warning"}
                      size="small"
                    />
                  </CardContent>
                </Card>
                <Card sx={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(20px)' }}>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                      Account Setup
                    </Typography>
                    <Chip 
                      label={user?.user_metadata?.setup_completed ? "Completed" : "Pending"} 
                      color={user?.user_metadata?.setup_completed ? "success" : "warning"}
                      size="small"
                    />
                  </CardContent>
                </Card>
              </Box>
            </Box>

            {/* Navigation */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => router.push('/dashboard')}
                sx={{ borderRadius: 2 }}
              >
                Back to Dashboard
              </Button>
              <Button
                variant="contained"
                onClick={() => router.push('/pay')}
                sx={{
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #E573B7, #7B61FF)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #D563A7, #6B51EF)',
                  }
                }}
              >
                Make Payment
              </Button>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
} 