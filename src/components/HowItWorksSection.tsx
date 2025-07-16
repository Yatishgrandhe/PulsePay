"use client";

import { Box, Typography, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { 
  PersonAdd, 
  Psychology, 
  Verified,
  Analytics as AnalyticsIcon,
  HealthAndSafety
} from '@mui/icons-material';

interface Step {
  icon: React.ReactNode;
  title: string;
  description: string;
  step: number;
  color: string;
}

const steps: Step[] = [
  {
    icon: <PersonAdd sx={{ fontSize: 48 }} />,
    title: "Register & Connect",
    description: "Sign up in seconds with email or biometrics. Connect your health devices and sync your medical history for personalized AI analysis.",
    step: 1,
    color: "#1E3A8A"
  },
  {
    icon: <Psychology sx={{ fontSize: 48 }} />,
    title: "AI Health Assessment",
    description: "Our advanced AI analyzes your symptoms, vital signs, and health data to provide accurate diagnostics and personalized recommendations.",
    step: 2,
    color: "#3B82F6"
  },
  {
    icon: <HealthAndSafety sx={{ fontSize: 48 }} />,
    title: "Get Health Insights",
    description: "Receive detailed health reports, treatment recommendations, and preventive care suggestions based on AI-powered analysis.",
    step: 3,
    color: "#10B981"
  },
  {
    icon: <AnalyticsIcon sx={{ fontSize: 48 }} />,
    title: "Monitor & Improve",
    description: "Track your health progress, view trends, and get predictive insights. Continuous monitoring helps you achieve better health outcomes.",
    step: 4,
    color: "#9CA3AF"
  }
];

export default function HowItWorksSection() {
  return (
    <Box sx={{ py: 8, background: 'white' }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: 3 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Typography 
            variant="h3" 
            textAlign="center" 
            fontWeight={700} 
            sx={{ mb: 2, color: 'text.primary' }}
          >
            How Health AI Works
          </Typography>
          <Typography 
            variant="h6" 
            textAlign="center" 
            sx={{ mb: 8, color: 'text.secondary', maxWidth: 600, mx: 'auto' }}
          >
            Four simple steps to revolutionize your health with AI
          </Typography>
        </motion.div>

        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
          gap: 4 
        }}>
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  height: '100%',
                  background: 'white',
                  borderRadius: 4,
                  border: '1px solid rgba(0,0,0,0.04)',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    borderColor: step.color,
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: `linear-gradient(90deg, ${step.color}, ${step.color}80)`,
                  }
                }}
              >
                {/* Step number badge */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: step.color,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: 700,
                  }}
                >
                  {step.step}
                </Box>

                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${step.color}15, ${step.color}30)`,
                    color: step.color,
                    mb: 3,
                    transition: 'all 0.3s ease',
                  }}
                >
                  {step.icon}
                </Box>
                
                <Typography 
                  variant="h5" 
                  fontWeight={600}
                  sx={{ mb: 2, color: 'text.primary' }}
                >
                  {step.title}
                </Typography>
                
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: 'text.secondary',
                    lineHeight: 1.6
                  }}
                >
                  {step.description}
                </Typography>
              </Paper>
            </motion.div>
          ))}
        </Box>

        {/* Connection lines for desktop */}
        <Box sx={{ 
          display: { xs: 'none', md: 'block' },
          position: 'relative',
          mt: 4,
          height: 2,
          background: 'linear-gradient(90deg, #1E3A8A, #3B82F6, #10B981, #9CA3AF)',
          borderRadius: 1,
          opacity: 0.3
        }} />
      </Box>
    </Box>
  );
} 