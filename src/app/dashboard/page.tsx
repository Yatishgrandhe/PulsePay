"use client";

import { useState, useEffect } from "react";
import { 
  Box, 
  Container, 
  Paper, 
  Typography, 
  Card,
  CardContent,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from "@mui/material";
import { 
  Psychology as PsychologyIcon,
  HealthAndSafety as HealthIcon,
  Person as PersonIcon,
  SmartToy as AIIcon,
  Analytics as AnalyticsIcon,
  ArrowForward as ArrowForwardIcon,
  Add as AddIcon
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";
import AnimatedLogo from "@/components/AnimatedLogo";
import Link from "next/link";

interface RecentActivity {
  id: string;
  session_type?: string;
  tool_type?: string;
  created_at: string;
}

interface DashboardStats {
  totalDiagnoses: number;
  healthScore: number;
  aiSessions: number;
  recentActivities: RecentActivity[];
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<{ id: string; email?: string; user_metadata?: { full_name?: string } } | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalDiagnoses: 0,
    healthScore: 85,
    aiSessions: 0,
    recentActivities: []
  });
  const router = useRouter();

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!supabase) return;
      
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login');
          return;
        }

        setUser(user);

        // Fetch AI chat sessions
        const { data: chatSessions } = await supabase
          .from('chat_sessions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        // Fetch health tools usage
        const { data: healthTools } = await supabase
          .from('health_tools_usage')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (chatSessions && healthTools) {
          const totalDiagnoses = healthTools.filter(tool => tool.tool_type === 'diagnosis').length;
          const recentActivities = [...chatSessions.slice(0, 3), ...healthTools.slice(0, 2)].sort(
            (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          ).slice(0, 5);

          setStats({
            totalDiagnoses,
            healthScore: 85, // This could be calculated from various health metrics
            aiSessions: chatSessions.length,
            recentActivities
          });
        }
      } catch (error: unknown) {
        setError(error instanceof Error ? error.message : 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const quickActions = [
    {
      title: 'AI Health Assistant',
      description: 'Chat with AI for health advice',
      icon: <AIIcon />,
      color: 'primary',
      href: '/health-tools'
    },
    {
      title: 'Health Analytics',
      description: 'View your health insights',
      icon: <AnalyticsIcon />,
      color: 'secondary',
      href: '/profile'
    },
    {
      title: 'Profile Settings',
      description: 'Manage your account',
      icon: <PersonIcon />,
      color: 'info',
      href: '/profile'
    },
    {
      title: 'Health Tools',
      description: 'Access wellness features',
      icon: <HealthIcon />,
      color: 'success',
      href: '/health-tools'
    }
  ];

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
        background: "linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)",
        py: 4,
        px: 2
      }}
    >
      <Container maxWidth="lg">
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
                  background: "linear-gradient(90deg, #1E3A8A, #3B82F6)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mt: 2,
                  mb: 1
                }}
              >
                Welcome back, {user?.user_metadata?.full_name || 'User'}!
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Here&apos;s your health AI dashboard
              </Typography>
            </Box>

            {/* Error Message */}
            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            {/* Stats Cards */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3 }}>
                <Card sx={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(20px)' }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <PsychologyIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
                      {stats.totalDiagnoses}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      AI Diagnoses
                    </Typography>
                  </CardContent>
                </Card>
                <Card sx={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(20px)' }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <AIIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main', mb: 1 }}>
                      {stats.aiSessions}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      AI Sessions
                    </Typography>
                  </CardContent>
                </Card>
                <Card sx={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(20px)' }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <HealthIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main', mb: 1 }}>
                      24/7
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      AI Support
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </Box>

            {/* Quick Actions */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: 'primary.main' }}>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2 }}>
                {quickActions.map((action, index) => (
                  <Box key={index}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card 
                        sx={{ 
                          background: 'rgba(255,255,255,0.9)', 
                          backdropFilter: 'blur(20px)',
                          cursor: 'pointer',
                          transition: 'transform 0.2s, box-shadow 0.2s',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: 8
                          }
                        }}
                        onClick={() => router.push(action.href)}
                      >
                        <CardContent sx={{ textAlign: 'center', p: 3 }}>
                          <Box sx={{ 
                            color: `${action.color}.main`, 
                            mb: 2,
                            display: 'flex',
                            justifyContent: 'center'
                          }}>
                            {action.icon}
                          </Box>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                            {action.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {action.description}
                          </Typography>
                          <Button
                            variant="outlined"
                            size="small"
                            endIcon={<ArrowForwardIcon />}
                            sx={{ borderRadius: 2 }}
                          >
                            Go
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Recent Activities */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                  Recent Activities
                </Typography>
                <Button
                  variant="text"
                  onClick={() => router.push('/health-tools')}
                  endIcon={<ArrowForwardIcon />}
                  sx={{ borderRadius: 2 }}
                >
                  View All
                </Button>
              </Box>

              {stats.recentActivities.length > 0 ? (
                <Card sx={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(20px)' }}>
                  <List>
                    {stats.recentActivities.map((activity, index) => (
                      <Box key={activity.id}>
                        <ListItem>
                          <ListItemIcon>
                            <Avatar sx={{ 
                              bgcolor: activity.session_type ? 'primary.main' : 'success.main',
                              width: 40,
                              height: 40
                            }}>
                              {activity.session_type ? <AIIcon /> : <HealthIcon />}
                            </Avatar>
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                  {activity.session_type ? 'AI Chat Session' : 'Health Tool Used'}
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 600, color: 'primary.main' }}>
                                  {activity.session_type ? 'AI Assistant' : activity.tool_type || 'Health Tool'}
                                </Typography>
                              </Box>
                            }
                            secondary={
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                  {activity.session_type ? 'AI health consultation' : 'Health assessment completed'}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                  <Chip 
                                    label={activity.session_type ? 'AI Chat' : 'Health Tool'} 
                                    color={activity.session_type ? 'primary' : 'success'}
                                    size="small"
                                  />
                                  <Typography variant="caption" color="text.secondary">
                                    {formatDate(activity.created_at)}
                                  </Typography>
                                </Box>
                              </Box>
                            }
                          />
                        </ListItem>
                        {index < stats.recentActivities.length - 1 && <Divider />}
                      </Box>
                    ))}
                  </List>
                </Card>
              ) : (
                <Card sx={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(20px)' }}>
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <AIIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                      No activities yet
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      Start using Health AI features to see your activities here
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => router.push('/health-tools')}
                      sx={{
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #1E3A8A, #3B82F6)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #1E40AF, #2563EB)',
                        }
                      }}
                    >
                      Start AI Session
                    </Button>
                  </CardContent>
                </Card>
              )}
            </Box>

            {/* Navigation */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => router.push('/profile')}
                sx={{ borderRadius: 2 }}
              >
                Profile Settings
              </Button>
              <Button
                variant="contained"
                onClick={() => router.push('/health-tools')}
                sx={{
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #1E3A8A, #3B82F6)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1E40AF, #2563EB)',
                  }
                }}
              >
                Start AI Session
              </Button>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
} 