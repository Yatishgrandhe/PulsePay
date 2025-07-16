"use client";

import { useState, useEffect } from "react";
import { 
  Box, 
  Container, 
  Paper, 
  Typography, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip
} from "@mui/material";
import { 
  Search as SearchIcon,
  Psychology as PsychologyIcon,
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
  SmartToy as AIIcon,
  HealthAndSafety as HealthIcon
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";

interface HealthActivity {
  id: string;
  activity_type: string;
  tool_type?: string;
  session_type?: string;
  description: string;
  status: string;
  duration?: number;
  created_at: string;
}

export default function HealthHistoryPage() {
  const [activities, setActivities] = useState<HealthActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const router = useRouter();

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login');
          return;
        }

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

        // Combine and format activities
        const combinedActivities: HealthActivity[] = [
          ...(chatSessions || []).map(session => ({
            id: session.id,
            activity_type: 'ai_chat',
            session_type: session.session_type,
            description: 'AI health consultation',
            status: 'completed',
            created_at: session.created_at
          })),
          ...(healthTools || []).map(tool => ({
            id: tool.id,
            activity_type: 'health_tool',
            tool_type: tool.tool_type,
            description: `${tool.tool_type} assessment`,
            status: 'completed',
            duration: tool.duration,
            created_at: tool.created_at
          }))
        ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        setActivities(combinedActivities);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load health history';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [router]);

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = 
      activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (activity.tool_type && activity.tool_type.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (activity.session_type && activity.session_type.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === "all" || activity.status === statusFilter;
    const matchesType = typeFilter === "all" || activity.activity_type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string): 'success' | 'warning' | 'error' | 'default' => {
    switch (status) {
      case 'completed': return 'success';
      case 'in_progress': return 'warning';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  const getTypeColor = (type: string): 'primary' | 'secondary' | 'default' => {
    switch (type) {
      case 'ai_chat': return 'primary';
      case 'health_tool': return 'secondary';
      default: return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4, px: 2 }}>
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
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 700,
                  background: "linear-gradient(90deg, #1E3A8A, #3B82F6)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 1
                }}
              >
                Health Activity History
              </Typography>
              <Typography variant="body1" color="text.secondary">
                View and manage your health AI activities
              </Typography>
            </Box>

            {/* Error Message */}
            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            {/* Stats Card */}
            <Card sx={{ mb: 4, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(20px)' }}>
              <CardContent>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(4, 1fr)' }, gap: 2 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                      {activities.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Activities
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'success.main' }}>
                      {activities.filter(a => a.status === 'completed').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Completed
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'info.main' }}>
                      {activities.filter(a => a.activity_type === 'ai_chat').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      AI Sessions
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                      {activities.filter(a => a.activity_type === 'health_tool').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Health Tools
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Filters */}
            <Box sx={{ mb: 3, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2 }}>
              <TextField
                fullWidth
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
              
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="in_progress">In Progress</MenuItem>
                  <MenuItem value="failed">Failed</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={typeFilter}
                  label="Type"
                  onChange={(e) => setTypeFilter(e.target.value)}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="ai_chat">AI Chat</MenuItem>
                  <MenuItem value="health_tool">Health Tool</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Activity Table */}
            {filteredActivities.length > 0 ? (
              <TableContainer component={Paper} sx={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(20px)' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Activity Type</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Duration</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredActivities.map((activity) => (
                      <TableRow key={activity.id} hover>
                        <TableCell>
                          <Typography variant="body2">
                            {formatDate(activity.created_at)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {activity.activity_type === 'ai_chat' ? <AIIcon /> : <HealthIcon />}
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {activity.activity_type === 'ai_chat' ? 'AI Chat' : 'Health Tool'}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {activity.description}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={activity.activity_type === 'ai_chat' ? 'AI Session' : (activity.tool_type || 'Health Tool')} 
                            color={getTypeColor(activity.activity_type) as any}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={activity.status} 
                            color={getStatusColor(activity.status) as any}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {activity.duration ? `${activity.duration} min` : 'N/A'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="View Details">
                              <IconButton size="small" color="primary">
                                <VisibilityIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Download Report">
                              <IconButton size="small" color="secondary">
                                <DownloadIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <PsychologyIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                  No activities found
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' 
                    ? 'Try adjusting your filters' 
                    : 'Start using Health AI features to see your activities here'
                  }
                </Typography>
                {!searchTerm && statusFilter === 'all' && typeFilter === 'all' && (
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
                )}
              </Box>
            )}

            {/* Navigation */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Button
                variant="outlined"
                onClick={() => router.push('/dashboard')}
                sx={{ borderRadius: 2 }}
              >
                Back to Dashboard
              </Button>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
} 