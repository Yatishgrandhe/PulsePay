"use client";

import { useState, useEffect } from "react";
import { 
  Box, 
  Container, 
  Paper, 
  Typography, 
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Alert
} from "@mui/material";
import { 
  CheckCircle as CheckCircleIcon,
  HealthAndSafety as HealthIcon,
  Email as EmailIcon,
  ArrowForward as ArrowForwardIcon,
  Home as HomeIcon
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import AnimatedLogo from "@/components/AnimatedLogo";
import Link from "next/link";

interface ServiceDetails {
  id: string;
  serviceName: string;
  patientName: string;
  patientEmail: string;
  description: string;
  serviceType: string;
  priority: string;
  appointmentDate: string;
  appointmentTime: string;
  price: string;
  status: string;
  createdAt: string;
}

export default function SuccessPage() {
  const [serviceDetails, setServiceDetails] = useState<ServiceDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const serviceId = searchParams.get('serviceId');
    
    if (serviceId) {
      // In a real app, you would fetch service details from the API
      // For now, we'll use the URL params to construct the details
      setServiceDetails({
        id: serviceId,
        serviceName: searchParams.get('serviceName') || 'Health Service',
        patientName: searchParams.get('patientName') || 'Patient',
        patientEmail: searchParams.get('patientEmail') || 'patient@example.com',
        description: searchParams.get('description') || 'Health consultation',
        serviceType: searchParams.get('serviceType') || 'ai_consultation',
        priority: searchParams.get('priority') || 'routine',
        appointmentDate: searchParams.get('appointmentDate') || new Date().toISOString().split('T')[0],
        appointmentTime: searchParams.get('appointmentTime') || '10:00',
        price: searchParams.get('price') || '50',
        status: 'confirmed',
        createdAt: new Date().toISOString()
      });
    }
    
    setLoading(false);
  }, [searchParams]);

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(parseFloat(amount));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <AnimatedLogo size={60} variant="compact" showWhiteCircle={false} />
        </motion.div>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
        px: 2
      }}
    >
      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
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
              textAlign: "center",
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
            {/* Logo */}
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
            </Box>

            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3, type: "spring" }}
            >
              <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
            </motion.div>

            {/* Success Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, color: 'success.main' }}>
                Service Booked Successfully!
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Your health service has been booked and a confirmation email has been sent.
              </Typography>
            </motion.div>

            {/* Service Details */}
            {serviceDetails && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Card sx={{ mb: 4, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(20px)' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <HealthIcon sx={{ mr: 2, color: 'primary.main' }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Service Details
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 3, mb: 3 }}>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                          Service
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                          {serviceDetails.serviceName}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                          Priority
                        </Typography>
                        <Chip 
                          label={serviceDetails.priority} 
                          color={serviceDetails.priority === 'emergency' ? 'error' : serviceDetails.priority === 'urgent' ? 'warning' : 'primary'}
                          size="small"
                        />
                      </Box>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                        Patient
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
                        {serviceDetails.patientName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {serviceDetails.patientEmail}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                        Appointment
                      </Typography>
                      <Typography variant="body2">
                        {new Date(serviceDetails.appointmentDate).toLocaleDateString()} at {serviceDetails.appointmentTime}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                        Description
                      </Typography>
                      <Typography variant="body2">
                        {serviceDetails.description}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                        Price
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                        {formatCurrency(serviceDetails.price)}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                        Booking ID
                      </Typography>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', color: 'primary.main' }}>
                        {serviceDetails.id}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Email Notification */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Alert 
                severity="info" 
                icon={<EmailIcon />}
                sx={{ mb: 4, borderRadius: 2 }}
              >
                A confirmation email has been sent to your registered email address with all the service details.
              </Alert>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, justifyContent: 'center' }}>
                <Button
                  variant="outlined"
                  startIcon={<HomeIcon />}
                  onClick={() => router.push('/dashboard')}
                  sx={{ borderRadius: 2 }}
                >
                  Go to Dashboard
                </Button>
                <Button
                  variant="contained"
                  startIcon={<ArrowForwardIcon />}
                  onClick={() => router.push('/pay')}
                  sx={{
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #1E3A8A, #3B82F6)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #1E40AF, #2563EB)',
                    }
                  }}
                >
                  Book Another Service
                </Button>
              </Box>
            </motion.div>

            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
                Need help? Contact our support team at support@healthai.com
              </Typography>
            </motion.div>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
} 