"use client";

import { Box, Typography, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { 
  Psychology, 
  Speed, 
  VerifiedUser,
  Analytics,
  HealthAndSafety,
  SmartToy
} from '@mui/icons-material';

interface FeatureItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

const features: FeatureItem[] = [
  {
    icon: <Psychology sx={{ fontSize: 48 }} />,
    title: "AI-Powered Diagnostics",
    description: "Advanced machine learning algorithms provide accurate health assessments and personalized recommendations.",
    color: "#1E3A8A"
  },
  {
    icon: <Speed sx={{ fontSize: 48 }} />,
    title: "Instant Analysis",
    description: "Get health insights and medical recommendations in seconds with our optimized AI infrastructure.",
    color: "#3B82F6"
  },
  {
    icon: <HealthAndSafety sx={{ fontSize: 48 }} />,
    title: "Comprehensive Health Monitoring",
    description: "Track vital signs, symptoms, and health trends with intelligent pattern recognition and alerts.",
    color: "#10B981"
  },
  {
    icon: <VerifiedUser sx={{ fontSize: 48 }} />,
    title: "Secure Health Records",
    description: "HIPAA-compliant data storage with biometric authentication and enterprise-grade security.",
    color: "#9CA3AF"
  },
  {
    icon: <SmartToy sx={{ fontSize: 48 }} />,
    title: "AI Health Assistant",
    description: "24/7 intelligent health companion providing personalized advice and emergency guidance.",
    color: "#6B7280"
  },
  {
    icon: <Analytics sx={{ fontSize: 48 }} />,
    title: "Health Analytics",
    description: "Comprehensive health reports, trend analysis, and predictive insights for better health outcomes.",
    color: "#1E40AF"
  }
];

export default function FeaturesSection() {
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
            Why Choose Health AI?
          </Typography>
          <Typography 
            variant="h6" 
            textAlign="center" 
            sx={{ mb: 6, color: 'text.secondary', maxWidth: 600, mx: 'auto' }}
          >
            Built with cutting-edge AI, designed for better health outcomes
          </Typography>
        </motion.div>

        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
          gap: 4 
        }}>
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
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
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    borderColor: feature.color,
                  }
                }}
              >
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${feature.color}15, ${feature.color}30)`,
                    color: feature.color,
                    mb: 3,
                    transition: 'all 0.3s ease',
                  }}
                >
                  {feature.icon}
                </Box>
                
                <Typography 
                  variant="h5" 
                  fontWeight={600}
                  sx={{ mb: 2, color: 'text.primary' }}
                >
                  {feature.title}
                </Typography>
                
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: 'text.secondary',
                    lineHeight: 1.6
                  }}
                >
                  {feature.description}
                </Typography>
              </Paper>
            </motion.div>
          ))}
        </Box>
      </Box>
    </Box>
  );
} 