"use client";

import { Box, Container, Typography, Paper, Card, CardContent, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { 
  Smartphone, 
  SmartToy, 
  AccountBalanceWallet, 
  CheckCircle, 
  Security,
  Speed,
  Public,
  Support
} from '@mui/icons-material';
import Navigation from '@/components/Navigation';
import ThemeProvider from '@/components/ThemeProvider';

const HeroSection = styled(Box)({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  padding: '120px 0 80px',
  color: 'white',
  textAlign: 'center',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("data:image/svg+xml,<svg xmlns=\\"http://www.w3.org/2000/svg\\" viewBox=\\"0 0 1000 1000\\"><polygon fill=\\"rgba(255,255,255,0.05)\\" points=\\"0,1000 1000,0 1000,1000\\"/></svg>")',
    backgroundSize: 'cover',
  }
});

const ProcessStep = styled(Card)({
  height: '100%',
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(123, 97, 255, 0.1)',
  borderRadius: 20,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 20px 40px rgba(123, 97, 255, 0.2)',
  }
});

const FeatureCard = styled(Card)({
  background: 'linear-gradient(135deg, rgba(123, 97, 255, 0.1) 0%, rgba(229, 115, 183, 0.1) 100%)',
  border: '1px solid rgba(123, 97, 255, 0.2)',
  borderRadius: 16,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: '0 12px 32px rgba(123, 97, 255, 0.15)',
  }
});

const processSteps = [
  {
    step: 1,
    title: "Emergency Occurs",
    description: "When a health emergency happens, time is critical. PulsePay is designed for instant response.",
    icon: <Smartphone sx={{ fontSize: 40, color: '#7B61FF' }} />,
    details: [
      "Patient or family member initiates emergency payment",
      "AI-powered system instantly assesses the situation",
      "Real-time verification of emergency status",
      "Immediate access to payment platform"
    ]
  },
  {
    step: 2,
    title: "AI Verification",
    description: "Our advanced AI system performs instant identity verification and fraud detection.",
    icon: <SmartToy sx={{ fontSize: 40, color: '#E573B7' }} />,
    details: [
      "OpenAI-powered ID text extraction",
      "Telesign device and phone verification",
      "IDAnalyzer global ID verification",
      "Real-time fraud scoring and risk assessment"
    ]
  },
  {
    step: 3,
    title: "Secure Payment",
    description: "Blockchain-secured payments are processed instantly with full transparency.",
    icon: <AccountBalanceWallet sx={{ fontSize: 40, color: '#FFD166' }} />,
    details: [
      "Connect your digital wallet (MetaMask, etc.)",
      "Choose payment amount and currency",
      "Blockchain transaction processing",
      "Instant confirmation and receipt"
    ]
  },
  {
    step: 4,
    title: "Hospital Receives Payment",
    description: "Partner hospitals receive immediate payment confirmation and can proceed with treatment.",
    icon: <CheckCircle sx={{ fontSize: 40, color: '#4CAF50' }} />,
    details: [
      "Instant payment notification to hospital",
      "Verifiable blockchain transaction record",
      "Automated receipt generation",
      "24/7 support for any issues"
    ]
  }
];

const keyFeatures = [
  {
    title: "AI-Powered Security",
    description: "Advanced machine learning algorithms for real-time fraud detection and identity verification.",
    icon: <Security sx={{ fontSize: 32, color: '#7B61FF' }} />
  },
  {
    title: "Lightning Fast",
    description: "Complete payment processing in under 30 seconds, even during peak emergency times.",
    icon: <Speed sx={{ fontSize: 32, color: '#E573B7' }} />
  },
  {
    title: "Global Reach",
    description: "Available worldwide with support for multiple currencies and payment methods.",
    icon: <Public sx={{ fontSize: 32, color: '#FFD166' }} />
  },
  {
    title: "24/7 Support",
    description: "Round-the-clock customer support for emergencies and technical assistance.",
    icon: <Support sx={{ fontSize: 32, color: '#4CAF50' }} />
  }
];

const benefits = [
  "No paperwork or lengthy approval processes",
  "Instant payment confirmation",
  "Transparent blockchain records",
  "Multi-layer security protection",
  "Global accessibility",
  "Real-time fraud prevention",
  "Automated compliance checks",
  "Seamless hospital integration"
];

export default function HowItWorksPage() {
  return (
    <ThemeProvider>
      <Box>
        <Navigation />
        
        {/* Hero Section */}
        <HeroSection>
          <Container maxWidth="lg">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography 
                variant="h1" 
                fontWeight={800}
                sx={{ 
                  mb: 3,
                  fontSize: { xs: '2.5rem', md: '4rem' },
                  textShadow: '0 4px 20px rgba(0,0,0,0.3)'
                }}
              >
                How PulsePay Works
              </Typography>
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: 4,
                  maxWidth: 800,
                  mx: 'auto',
                  opacity: 0.9,
                  textShadow: '0 2px 10px rgba(0,0,0,0.2)'
                }}
              >
                From emergency to payment in under 30 seconds. Our AI-powered platform 
                makes emergency health payments instant, secure, and verifiable.
              </Typography>
            </motion.div>
          </Container>
        </HeroSection>

        {/* Process Steps */}
        <Box sx={{ py: 10, background: '#f8f9ff' }}>
          <Container maxWidth="lg">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography 
                variant="h2" 
                fontWeight={700}
                textAlign="center"
                sx={{ mb: 6, color: '#232946' }}
              >
                The 4-Step Process
              </Typography>
            </motion.div>

            <Box sx={{ 
              display: 'grid', 
              gap: 4,
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }
            }}>
              {processSteps.map((step, index) => (
                <Box key={step.step}>
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                  >
                    <ProcessStep>
                      <CardContent sx={{ p: 4, textAlign: 'center' }}>
                        <Box sx={{ mb: 3 }}>
                          <Chip 
                            label={`Step ${step.step}`}
                            sx={{ 
                              background: 'linear-gradient(45deg, #7B61FF, #E573B7)',
                              color: 'white',
                              fontWeight: 600,
                              mb: 2
                            }}
                          />
                          <Box sx={{ mb: 2 }}>
                            {step.icon}
                          </Box>
                        </Box>
                        
                        <Typography 
                          variant="h5" 
                          fontWeight={600}
                          sx={{ mb: 2, color: '#232946' }}
                        >
                          {step.title}
                        </Typography>
                        
                        <Typography 
                          variant="body1" 
                          sx={{ mb: 3, color: '#666', lineHeight: 1.8, fontSize: '1.1rem' }}
                        >
                          {step.description}
                        </Typography>

                        <Box component="ul" sx={{ textAlign: 'left', pl: 2 }}>
                          {step.details.map((detail, idx) => (
                            <Typography 
                              key={idx}
                              component="li" 
                              variant="body2"
                              sx={{ 
                                mb: 1.5, 
                                color: '#555',
                                fontSize: '1rem',
                                lineHeight: 1.6,
                                '&::marker': { color: '#7B61FF' }
                              }}
                            >
                              {detail}
                            </Typography>
                          ))}
                        </Box>
                      </CardContent>
                    </ProcessStep>
                  </motion.div>
                </Box>
              ))}
            </Box>
          </Container>
        </Box>

        {/* Key Features */}
        <Box sx={{ py: 10 }}>
          <Container maxWidth="lg">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography 
                variant="h2" 
                fontWeight={700}
                textAlign="center"
                sx={{ mb: 6, color: '#232946' }}
              >
                Why Choose PulsePay?
              </Typography>
            </motion.div>

            <Box sx={{ 
              display: 'grid', 
              gap: 4,
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }
            }}>
              {keyFeatures.map((feature, index) => (
                <Box key={feature.title}>
                  <motion.div
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                  >
                    <FeatureCard>
                      <CardContent sx={{ p: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                          {feature.icon}
                          <Typography 
                            variant="h5" 
                            fontWeight={600}
                            sx={{ ml: 2, color: '#232946' }}
                          >
                            {feature.title}
                          </Typography>
                        </Box>
                        <Typography 
                          variant="body1" 
                          sx={{ color: '#666', lineHeight: 1.8, fontSize: '1.1rem' }}
                        >
                          {feature.description}
                        </Typography>
                      </CardContent>
                    </FeatureCard>
                  </motion.div>
                </Box>
              ))}
            </Box>
          </Container>
        </Box>

        {/* Benefits Section */}
        <Box sx={{ py: 10, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <Container maxWidth="lg">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography 
                variant="h2" 
                fontWeight={700}
                textAlign="center"
                sx={{ mb: 6, color: 'white' }}
              >
                Key Benefits
              </Typography>
            </motion.div>

            <Box sx={{ 
              display: 'grid', 
              gap: 3,
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }
            }}>
              {benefits.map((benefit, index) => (
                <Box key={benefit}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Paper 
                      sx={{ 
                        p: 3, 
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: 3,
                        textAlign: 'center'
                      }}
                    >
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          color: 'white', 
                          fontWeight: 500,
                          fontSize: '1.1rem'
                        }}
                      >
                        {benefit}
                      </Typography>
                    </Paper>
                  </motion.div>
                </Box>
              ))}
            </Box>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <Box sx={{ textAlign: 'center', mt: 8 }}>
                <Typography 
                  variant="h4" 
                  fontWeight={600}
                  sx={{ mb: 3, color: 'white' }}
                >
                  Ready to Experience the Future of Emergency Payments?
                </Typography>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Box
                    component="a"
                    href="/register"
                    sx={{
                      display: 'inline-block',
                      px: 6,
                      py: 3,
                      background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: 50,
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      boxShadow: '0 8px 32px rgba(255,107,107,0.4)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 12px 40px rgba(255,107,107,0.6)',
                      }
                    }}
                  >
                    Get Started Now
                  </Box>
                </motion.div>
              </Box>
            </motion.div>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
} 