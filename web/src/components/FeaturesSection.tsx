"use client";

import { Box, Typography, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { 
  Security, 
  Speed, 
  Public, 
  VerifiedUser,
  Support,
  Analytics
} from '@mui/icons-material';

interface FeatureItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

const features: FeatureItem[] = [
  {
    icon: <Security sx={{ fontSize: 48 }} />,
    title: "AI-Powered Verification",
    description: "Real-time fraud detection and instant eligibility checks using advanced machine learning algorithms.",
    color: "#7B61FF"
  },
  {
    icon: <Speed sx={{ fontSize: 48 }} />,
    title: "Lightning Fast",
    description: "Process emergency payments in under 0.3 seconds with our optimized blockchain infrastructure.",
    color: "#E573B7"
  },
  {
    icon: <Public sx={{ fontSize: 48 }} />,
    title: "Global Coverage",
    description: "Send emergency payments to 45+ countries with real-time currency conversion and compliance.",
    color: "#10B981"
  },
  {
    icon: <VerifiedUser sx={{ fontSize: 48 }} />,
    title: "One-Click Authentication",
    description: "Seamless login with biometrics, WalletConnect, or email with enterprise-grade security.",
    color: "#FFD166"
  },
  {
    icon: <Support sx={{ fontSize: 48 }} />,
    title: "24/7 Support",
    description: "Round-the-clock customer support with AI chatbots and human experts ready to help.",
    color: "#3B82F6"
  },
  {
    icon: <Analytics sx={{ fontSize: 48 }} />,
    title: "Real-time Analytics",
    description: "Track payments, view analytics, and export detailed reports for compliance and transparency.",
    color: "#8B5CF6"
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
            Why Choose PulsePay?
          </Typography>
          <Typography 
            variant="h6" 
            textAlign="center" 
            sx={{ mb: 6, color: 'text.secondary', maxWidth: 600, mx: 'auto' }}
          >
            Built for emergency situations, designed for peace of mind
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