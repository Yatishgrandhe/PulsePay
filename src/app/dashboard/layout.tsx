"use client";

import { useState, useEffect } from "react";
import { 
  Box, 
  Drawer, 
  AppBar, 
  Toolbar, 
  List, 
  Typography, 
  Divider, 
  IconButton, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Chip
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  AccountBalanceWallet as WalletIcon,
  Payment as PaymentIcon,
  History as HistoryIcon,
  Person as ProfileIcon,
  Settings as SettingsIcon,
  AdminPanelSettings as AdminIcon,
  HealthAndSafety as HealthIcon,
  Psychology as TherapistIcon,
  FitnessCenter as FitnessIcon,
  Straighten as PostureIcon,
  Bookmark as SavedIcon,
  Notifications as NotificationsIcon,
  Menu as MenuIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountIcon
} from "@mui/icons-material";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/utils/supabaseClient";
import Logo from "@/components/Logo";
import Link from "next/link";

const drawerWidth = 280;

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface MenuItem {
  text: string;
  icon: React.ReactNode;
  path: string;
  badge?: number;
  category?: string;
}

const menuItems: MenuItem[] = [
  // Main Dashboard
  { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
  
  // Health Services
  { text: "Book Health Service", icon: <PaymentIcon />, path: "/pay", category: "Health Services" },
  { text: "Health Activity History", icon: <HistoryIcon />, path: "/dashboard/history" },
  
  // Health & Wellness
  { text: "Health Tools", icon: <HealthIcon />, path: "/health-tools", category: "Health & Wellness" },
  { text: "Therapist Chat", icon: <TherapistIcon />, path: "/health-tools/therapist-chat" },
  { text: "Posture Check", icon: <PostureIcon />, path: "/health-tools/posture-check" },
  { text: "Fitness Planner", icon: <FitnessIcon />, path: "/health-tools/fitness-planner" },
  { text: "Saved Routines", icon: <SavedIcon />, path: "/health-tools/saved-routines" },
  
  // Account & Settings
  { text: "Profile", icon: <ProfileIcon />, path: "/dashboard/profile", category: "Account" },
  { text: "Settings", icon: <SettingsIcon />, path: "/dashboard/settings" },
  
  // Admin (conditional)
  { text: "Admin Panel", icon: <AdminIcon />, path: "/admin", category: "Administration" },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<{ id: string; email?: string; user_metadata?: { full_name?: string; account_type?: string } } | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifications] = useState(3); // Mock notifications
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);
    };
    getUser();
  }, [router]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(path);
  };

  const groupedMenuItems = menuItems.reduce((acc, item) => {
    const category = item.category || 'Main';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo and Header */}
      <Box sx={{ 
        p: 3, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <Link href="/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Logo size={40} variant="compact" showText={false} />
            <Typography variant="h6" sx={{ 
              fontWeight: 700,
              background: "linear-gradient(90deg, #1E3A8A, #3B82F6)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>
              Health AI
            </Typography>
          </Box>
        </Link>
      </Box>

      {/* Navigation Menu */}
      <Box sx={{ flex: 1, overflow: 'auto', py: 2 }}>
        {Object.entries(groupedMenuItems).map(([category, items]) => (
          <Box key={category}>
            {category !== 'Main' && (
              <Typography
                variant="caption"
                sx={{
                  px: 3,
                  py: 1,
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                {category}
              </Typography>
            )}
            <List>
              {items.map((item) => (
                <ListItem key={item.text} disablePadding>
                  <ListItemButton
                    component={Link}
                    href={item.path}
                    selected={isActive(item.path)}
                    sx={{
                      mx: 1,
                      borderRadius: 2,
                      mb: 0.5,
                      '&.Mui-selected': {
                        background: 'linear-gradient(90deg, rgba(229, 115, 183, 0.2), rgba(123, 97, 255, 0.2))',
                        border: '1px solid rgba(229, 115, 183, 0.3)',
                        '&:hover': {
                          background: 'linear-gradient(90deg, rgba(229, 115, 183, 0.3), rgba(123, 97, 255, 0.3))',
                        }
                      },
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.05)',
                      }
                    }}
                  >
                    <ListItemIcon sx={{ 
                      color: isActive(item.path) ? '#E573B7' : 'rgba(255, 255, 255, 0.7)',
                      minWidth: 40
                    }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.text} 
                      sx={{
                        '& .MuiListItemText-primary': {
                          fontWeight: isActive(item.path) ? 600 : 400,
                          color: isActive(item.path) ? 'white' : 'rgba(255, 255, 255, 0.8)'
                        }
                      }}
                    />
                    {item.badge && (
                      <Badge badgeContent={item.badge} color="error" />
                    )}
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            {category !== Object.keys(groupedMenuItems).slice(-1)[0] && (
              <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
            )}
          </Box>
        ))}
      </Box>

      {/* User Profile Section */}
      <Box sx={{ 
        p: 2, 
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        background: 'rgba(255, 255, 255, 0.02)'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Avatar sx={{ 
            width: 40, 
            height: 40,
            background: 'linear-gradient(135deg, #E573B7, #7B61FF)'
          }}>
            {user?.email?.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" sx={{ 
              fontWeight: 600, 
              color: 'white',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {user?.user_metadata?.full_name || user?.email}
            </Typography>
            <Typography variant="caption" sx={{ 
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '0.7rem'
            }}>
              {user?.user_metadata?.account_type || 'User'}
            </Typography>
          </Box>
        </Box>
        <Chip
          label="Verified"
          size="small"
          sx={{
            background: 'rgba(76, 175, 80, 0.2)',
            color: '#4CAF50',
            border: '1px solid rgba(76, 175, 80, 0.3)',
            fontSize: '0.7rem'
          }}
        />
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
          boxShadow: '0 2px 20px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon sx={{ color: '#333' }} />
          </IconButton>
          
          <Typography variant="h6" sx={{ flexGrow: 1, color: '#333', fontWeight: 600 }}>
            {menuItems.find(item => isActive(item.path))?.text || 'Dashboard'}
          </Typography>

          {/* Notifications */}
          <IconButton color="inherit" sx={{ mr: 1 }}>
            <Badge badgeContent={notifications} color="error">
              <NotificationsIcon sx={{ color: '#333' }} />
            </Badge>
          </IconButton>

          {/* Profile Menu */}
          <IconButton
            onClick={handleProfileMenuOpen}
            sx={{ color: '#333' }}
          >
            <AccountIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 200,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
              }
            }}
          >
            <MenuItem onClick={() => { router.push('/dashboard/profile'); handleProfileMenuClose(); }}>
              <ListItemIcon>
                <ProfileIcon fontSize="small" />
              </ListItemIcon>
              Profile
            </MenuItem>
            <MenuItem onClick={() => { router.push('/dashboard/settings'); handleProfileMenuClose(); }}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleSignOut}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Sign Out
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              background: 'linear-gradient(180deg, #232946 0%, #1A1A2E 100%)',
              border: 'none'
            },
          }}
        >
          {drawer}
        </Drawer>
        
        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              background: 'linear-gradient(180deg, #232946 0%, #1A1A2E 100%)',
              border: 'none',
              boxShadow: '4px 0 20px rgba(0, 0, 0, 0.1)'
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          background: '#f8fafc',
          minHeight: '100vh'
        }}
      >
        <Toolbar /> {/* Spacer for AppBar */}
        <Box sx={{ p: 3 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </Box>
      </Box>
    </Box>
  );
} 