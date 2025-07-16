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
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Divider
} from "@mui/material";
import { 
  HealthAndSafety as HealthIcon,
  Send as SendIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon,
  Receipt as ReceiptIcon,
  Psychology as PsychologyIcon
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";
import AnimatedLogo from "@/components/AnimatedLogo";
import Link from "next/link";

interface ServiceData {
  serviceType: string;
  serviceName: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  description: string;
  appointmentDate: string;
  appointmentTime: string;
  priority: 'routine' | 'urgent' | 'emergency';
}

const steps = [
  'Service Details',
  'Patient Information',
  'Review & Confirm'
];

const serviceTypes = [
  { value: 'ai_consultation', label: 'AI Health Consultation', price: 50 },
  { value: 'health_assessment', label: 'Health Assessment', price: 75 },
  { value: 'diagnostic_test', label: 'Diagnostic Test', price: 100 },
  { value: 'therapy_session', label: 'Therapy Session', price: 120 },
  { value: 'preventive_care', label: 'Preventive Care', price: 60 }
];

export default function HealthServicePage() {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [user, setUser] = useState<{ id: string; email?: string; user_metadata?: { full_name?: string } } | null>(null);
  const [serviceResult, setServiceResult] = useState<any>(null);
  const router = useRouter();

  const [serviceData, setServiceData] = useState<ServiceData>({
    serviceType: '',
    serviceName: '',
    patientName: '',
    patientEmail: '',
    patientPhone: '',
    description: '',
    appointmentDate: '',
    appointmentTime: '',
    priority: 'routine'
  });

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      
      setUser(user);
    };
    
    checkUser();
  }, [router]);

  const handleInputChange = (field: keyof ServiceData, value: string) => {
    setServiceData(prev => ({
      ...prev,
      [field]: value
    }));
    setError(null);
  };

  const getServicePrice = (serviceType: string) => {
    const service = serviceTypes.find(s => s.value === serviceType);
    return service ? service.price : 0;
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 0:
        if (!serviceData.serviceType) {
          setError("Please select a service type.");
          return false;
        }
        if (!serviceData.description.trim()) {
          setError("Please enter a description of your health concern.");
          return false;
        }
        break;
      case 1:
        if (!serviceData.patientName.trim()) {
          setError("Please enter patient name.");
          return false;
        }
        if (!serviceData.patientEmail.trim() || !serviceData.patientEmail.includes('@')) {
          setError("Please enter a valid patient email.");
          return false;
        }
        if (!serviceData.patientPhone.trim()) {
          setError("Please enter patient phone number.");
          return false;
        }
        if (!serviceData.appointmentDate) {
          setError("Please select an appointment date.");
          return false;
        }
        if (!serviceData.appointmentTime) {
          setError("Please select an appointment time.");
          return false;
        }
        break;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevStep) => prevStep + 1);
      setError(null);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    setError(null);
  };

  const handleServiceBooking = async () => {
    if (!validateStep(activeStep)) return;
    
    setLoading(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('No valid session');
      }

      const response = await fetch('/api/health-service', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          serviceType: serviceData.serviceType,
          serviceName: serviceData.serviceName,
          patientName: serviceData.patientName,
          patientEmail: serviceData.patientEmail,
          patientPhone: serviceData.patientPhone,
          description: serviceData.description,
          appointmentDate: serviceData.appointmentDate,
          appointmentTime: serviceData.appointmentTime,
          priority: serviceData.priority,
          price: getServicePrice(serviceData.serviceType)
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Service booking failed');
      }

      setServiceResult(result.service);
      setSuccess("Health service booked successfully!");
      
    } catch (error: any) {
      setError(error.message || "An error occurred during service booking.");
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="h6" sx={{ mb: 3, color: "primary.main", fontWeight: 600 }}>
              <HealthIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Service Details
            </Typography>
            
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Service Type</InputLabel>
                <Select
                  value={serviceData.serviceType}
                  label="Service Type"
                  onChange={(e) => {
                    handleInputChange('serviceType', e.target.value);
                    const service = serviceTypes.find(s => s.value === e.target.value);
                    if (service) {
                      handleInputChange('serviceName', service.label);
                    }
                  }}
                >
                  {serviceTypes.map((service) => (
                    <MenuItem key={service.value} value={service.value}>
                      {service.label} - ${service.price}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Priority Level</InputLabel>
                <Select
                  value={serviceData.priority}
                  label="Priority Level"
                  onChange={(e) => handleInputChange('priority', e.target.value)}
                >
                  <MenuItem value="routine">Routine</MenuItem>
                  <MenuItem value="urgent">Urgent</MenuItem>
                  <MenuItem value="emergency">Emergency</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Health Concern Description"
                value={serviceData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                required
                multiline
                rows={4}
                placeholder="Describe your symptoms, concerns, or what you'd like to discuss..."
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Box>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="h6" sx={{ mb: 3, color: "primary.main", fontWeight: 600 }}>
              <SendIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Patient Information
            </Typography>
            
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <TextField
                fullWidth
                label="Patient Name"
                value={serviceData.patientName}
                onChange={(e) => handleInputChange('patientName', e.target.value)}
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />

              <TextField
                fullWidth
                label="Patient Email"
                type="email"
                value={serviceData.patientEmail}
                onChange={(e) => handleInputChange('patientEmail', e.target.value)}
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />

              <TextField
                fullWidth
                label="Patient Phone"
                value={serviceData.patientPhone}
                onChange={(e) => handleInputChange('patientPhone', e.target.value)}
                required
                placeholder="+1 (555) 123-4567"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />

              <TextField
                fullWidth
                label="Appointment Date"
                type="date"
                value={serviceData.appointmentDate}
                onChange={(e) => handleInputChange('appointmentDate', e.target.value)}
                required
                InputLabelProps={{ shrink: true }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />

              <TextField
                fullWidth
                label="Appointment Time"
                type="time"
                value={serviceData.appointmentTime}
                onChange={(e) => handleInputChange('appointmentTime', e.target.value)}
                required
                InputLabelProps={{ shrink: true }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Box>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="h6" sx={{ mb: 3, color: "primary.main", fontWeight: 600 }}>
              <ReceiptIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Review & Confirm
            </Typography>
            
            <Card sx={{ mb: 3, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(20px)' }}>
              <CardContent>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 700, color: 'primary.main' }}>
                  Service Summary
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Service:</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {serviceData.serviceName}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Price:</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'success.main' }}>
                    ${getServicePrice(serviceData.serviceType)}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Priority:</Typography>
                  <Chip 
                    label={serviceData.priority} 
                    color={serviceData.priority === 'emergency' ? 'error' : serviceData.priority === 'urgent' ? 'warning' : 'primary'}
                    size="small"
                  />
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Patient:</Typography>
                <Typography sx={{ mb: 1 }}>{serviceData.patientName}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {serviceData.patientEmail}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {serviceData.patientPhone}
                </Typography>
                
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Appointment:</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {new Date(serviceData.appointmentDate).toLocaleDateString()} at {serviceData.appointmentTime}
                </Typography>
                
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Description:</Typography>
                <Typography variant="body2" color="text.secondary">
                  {serviceData.description}
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        );
    }
  };

  if (success && serviceResult) {
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
        <Container maxWidth="sm">
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
                textAlign: "center"
              }}
            >
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

              <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
              
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, color: 'success.main' }}>
                Service Booked Successfully!
              </Typography>
              
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Your health service has been booked and a confirmation email has been sent.
              </Typography>

              <Card sx={{ mb: 3, background: 'rgba(0,0,0,0.02)' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {serviceData.serviceName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Patient: {serviceResult.patientName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Date: {new Date(serviceData.appointmentDate).toLocaleDateString()} at {serviceData.appointmentTime}
                  </Typography>
                  <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'primary.main' }}>
                    Booking ID: {serviceResult.id}
                  </Typography>
                </CardContent>
              </Card>

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                  variant="outlined"
                  onClick={() => router.push('/dashboard')}
                  sx={{ borderRadius: 2 }}
                >
                  Go to Dashboard
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    setSuccess(null);
                    setServiceResult(null);
                    setActiveStep(0);
                    setServiceData({
                      serviceType: '',
                      serviceName: '',
                      patientName: '',
                      patientEmail: '',
                      patientPhone: '',
                      description: '',
                      appointmentDate: '',
                      appointmentTime: '',
                      priority: 'routine'
                    });
                  }}
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
            </Paper>
          </motion.div>
        </Container>
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
                Book Health Service
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Schedule your health consultation with Health AI
              </Typography>
            </Box>

            {/* Stepper */}
            <Box sx={{ mb: 4 }}>
              <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
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

            {/* Step Content */}
            <Box sx={{ mb: 4 }}>
              {renderStepContent(activeStep)}
            </Box>

            {/* Navigation Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                startIcon={<ArrowBackIcon />}
                sx={{ borderRadius: 2 }}
              >
                Back
              </Button>
              
              <Box>
                {activeStep === steps.length - 1 ? (
                  <Button
                    variant="contained"
                    onClick={handleServiceBooking}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : <CheckCircleIcon />}
                    sx={{
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #1E3A8A, #3B82F6)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #1E40AF, #2563EB)',
                      }
                    }}
                  >
                    {loading ? 'Processing...' : 'Confirm Booking'}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #1E3A8A, #3B82F6)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #1E40AF, #2563EB)',
                      }
                    }}
                  >
                    Next
                  </Button>
                )}
              </Box>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
} 