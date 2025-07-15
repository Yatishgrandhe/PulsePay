"use client";

import { useState, useEffect } from "react";
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Avatar, 
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Alert,
  IconButton
} from "@mui/material";
import {
  AccountBalanceWallet as WalletIcon,
  Payment as PaymentIcon,
  TrendingUp as TrendingUpIcon,
  Security as SecurityIcon,
  HealthAndSafety as HealthIcon,
  Notifications as NotificationsIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { supabase } from "@/utils/supabaseClient";
import Link from "next/link";

interface Payment {
  id: string;
  amount: string;
  status: string;
  created_at: string;
  description?: string;
}

interface DashboardStats {
  totalPayments: number;
  totalSpent: number;
  walletBalance: number;
  kycStatus: string;
  fraudScore: number;
  recentPayments: Payment[];
  healthToolsUsed: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPayments: 0,
    totalSpent: 0,
    walletBalance: 0,
    kycStatus: 'pending',
    fraudScore: 0,
    recentPayments: [],
    healthToolsUsed: 0
  });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ user_metadata?: { full_name?: string } } | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        
        setUser(user);

        // Fetch user profile
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        // Fetch wallet data
        const { data: wallet } = await supabase
          .from('wallets')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .single();

        // Fetch recent payments
        const { data: payments } = await supabase
          .from('payments')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        // Fetch payment stats
        const { data: paymentStats } = await supabase
          .from('payments')
          .select('amount, status')
          .eq('user_id', user.id);

        // Fetch health tools usage
        const { data: healthUsage } = await supabase
          .from('health_tools_usage')
          .select('*')
          .eq('user_id', user.id);

        const totalPayments = paymentStats?.length || 0;
        const totalSpent = paymentStats
          ?.filter(p => p.status === 'completed')
          ?.reduce((sum, p) => sum + parseFloat(p.amount), 0) || 0;

        setStats({
          totalPayments,
          totalSpent,
          walletBalance: wallet?.balance || 0,
          kycStatus: profile?.kyc_status || 'pending',
          fraudScore: profile?.fraud_score || 0,
          recentPayments: payments || [],
          healthToolsUsed: healthUsage?.length || 0
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getKycStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const getFraudScoreColor = (score: number) => {
    if (score <= 20) return 'success';
    if (score <= 50) return 'warning';
    return 'error';
  };

  const StatCard = ({ title, value, icon, color, subtitle, action }: { title: string; value: string | number; icon: React.ReactNode; color: string; subtitle?: string; action?: boolean }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card sx={{ 
        height: '100%',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.2)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
        }
      }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Avatar sx={{ 
              background: `linear-gradient(135deg, ${color}, ${color}dd)`,
              width: 48,
              height: 48
            }}>
              {icon}
            </Avatar>
            {action && (
              <IconButton size="small" sx={{ color: 'primary.main' }}>
                <ArrowForwardIcon />
              </IconButton>
            )}
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: '#1a1a1a' }}>
            {value}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {subtitle}
            </Typography>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <LinearProgress sx={{ width: '100%', maxWidth: 400 }} />
      </Box>
    );
  }

  return (
    <Box>
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" sx={{ 
            fontWeight: 700, 
            mb: 1,
            background: "linear-gradient(90deg, #E573B7, #7B61FF)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            Welcome back, {user?.user_metadata?.full_name || 'User'}!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here&apos;s what&apos;s happening with your PulsePay account today.
          </Typography>
        </Box>
      </motion.div>

      {/* Status Alerts */}
      {stats.kycStatus === 'pending' && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Alert 
            severity="warning" 
            icon={<InfoIcon />}
            sx={{ mb: 3, borderRadius: 2 }}
            action={
              <Button color="inherit" size="small" component={Link} href="/dashboard/profile">
                Complete KYC
              </Button>
            }
          >
            Please complete your KYC verification to unlock all features.
          </Alert>
        </motion.div>
      )}

      {/* Stats Grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
        <StatCard
          title="Total Payments"
          value={stats.totalPayments}
          icon={<PaymentIcon />}
          color="#E573B7"
          subtitle="All time"
          action
        />
        <StatCard
          title="Total Spent"
          value={`$${stats.totalSpent.toFixed(2)}`}
          icon={<TrendingUpIcon />}
          color="#7B61FF"
          subtitle="Completed payments"
          action
        />
        <StatCard
          title="Wallet Balance"
          value={`$${stats.walletBalance.toFixed(2)}`}
          icon={<WalletIcon />}
          color="#FFD166"
          subtitle="Available funds"
          action
        />
        <StatCard
          title="Health Tools Used"
          value={stats.healthToolsUsed}
          icon={<HealthIcon />}
          color="#4CAF50"
          subtitle="This month"
          action
        />
      </Box>

      {/* Security & Status Section */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3, mb: 4 }}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card sx={{ 
            background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.2)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <SecurityIcon sx={{ mr: 2, color: 'primary.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Security Status
                </Typography>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2">KYC Status</Typography>
                  <Chip 
                    label={stats.kycStatus} 
                    color={getKycStatusColor(stats.kycStatus) as 'success' | 'warning' | 'error' | 'default'}
                    size="small"
                  />
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={stats.kycStatus === 'approved' ? 100 : 50}
                  sx={{ height: 6, borderRadius: 3 }}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2">Fraud Risk Score</Typography>
                  <Chip 
                    label={`${stats.fraudScore}/100`} 
                    color={getFraudScoreColor(stats.fraudScore) as 'success' | 'warning' | 'error'}
                    size="small"
                  />
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={100 - stats.fraudScore}
                  color={getFraudScoreColor(stats.fraudScore) as 'success' | 'warning' | 'error'}
                  sx={{ height: 6, borderRadius: 3 }}
                />
              </Box>

              <Button 
                variant="outlined" 
                fullWidth 
                component={Link}
                href="/dashboard/profile"
                sx={{ mt: 2 }}
              >
                View Security Settings
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card sx={{ 
            background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.2)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <NotificationsIcon sx={{ mr: 2, color: 'primary.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Recent Activity
                </Typography>
              </Box>
              
              {stats.recentPayments.length > 0 ? (
                <List sx={{ p: 0 }}>
                  {stats.recentPayments.slice(0, 3).map((payment, index) => (
                    <Box key={payment.id}>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          <Avatar sx={{ 
                            width: 32, 
                            height: 32,
                            background: payment.status === 'completed' 
                              ? 'linear-gradient(135deg, #4CAF50, #45a049)' 
                              : 'linear-gradient(135deg, #FF9800, #F57C00)'
                          }}>
                            {payment.status === 'completed' ? <CheckCircleIcon /> : <WarningIcon />}
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={`$${parseFloat(payment.amount).toFixed(2)}`}
                          secondary={payment.description || 'Payment'}
                          primaryTypographyProps={{ fontWeight: 600 }}
                          secondaryTypographyProps={{ fontSize: '0.8rem' }}
                        />
                        <Chip 
                          label={payment.status} 
                          size="small"
                          color={payment.status === 'completed' ? 'success' : 'warning'}
                        />
                      </ListItem>
                      {index < Math.min(2, stats.recentPayments.length - 1) && (
                        <Divider sx={{ my: 1 }} />
                      )}
                    </Box>
                  ))}
                </List>
              ) : (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    No recent payments
                  </Typography>
                </Box>
              )}

              <Button 
                variant="outlined" 
                fullWidth 
                component={Link}
                href="/dashboard/history"
                sx={{ mt: 2 }}
              >
                View All Payments
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </Box>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card sx={{ 
          background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.2)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Quick Actions
            </Typography>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2 }}>
              <Button
                variant="contained"
                fullWidth
                component={Link}
                href="/pay"
                sx={{
                  py: 2,
                  background: 'linear-gradient(135deg, #E573B7, #7B61FF)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #D563A7, #6B51EF)',
                  }
                }}
              >
                <PaymentIcon sx={{ mr: 1 }} />
                Make Payment
              </Button>
              <Button
                variant="outlined"
                fullWidth
                component={Link}
                href="/dashboard/wallet"
                sx={{ py: 2 }}
              >
                <WalletIcon sx={{ mr: 1 }} />
                View Wallet
              </Button>
              <Button
                variant="outlined"
                fullWidth
                component={Link}
                href="/health-tools"
                sx={{ py: 2 }}
              >
                <HealthIcon sx={{ mr: 1 }} />
                Health Tools
              </Button>
              <Button
                variant="outlined"
                fullWidth
                component={Link}
                href="/dashboard/settings"
                sx={{ py: 2 }}
              >
                <SecurityIcon sx={{ mr: 1 }} />
                Settings
              </Button>
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
} 