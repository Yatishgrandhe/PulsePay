"use client";

import { useState, useEffect } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { 
  Group, 
  Psychology, 
  FlashOn,
  HealthAndSafety,
  SmartToy,
  Analytics
} from '@mui/icons-material';
import { useInView } from 'react-intersection-observer';

interface StatItem {
  icon: React.ReactNode;
  value: number;
  suffix: string;
  label: string;
  color: string;
}

const stats: StatItem[] = [
  {
    icon: <Psychology sx={{ fontSize: 40 }} />,
    value: 1.2,
    suffix: "M+",
    label: "AI Diagnoses Made",
    color: "#1E3A8A"
  },
  {
    icon: <Group sx={{ fontSize: 40 }} />,
    value: 250,
    suffix: "K+",
    label: "Active Users",
    color: "#3B82F6"
  },
  {
    icon: <HealthAndSafety sx={{ fontSize: 40 }} />,
    value: 98.5,
    suffix: "%",
    label: "Diagnostic Accuracy",
    color: "#10B981"
  },
  {
    icon: <FlashOn sx={{ fontSize: 40 }} />,
    value: 15,
    suffix: "s",
    label: "Average Analysis Time",
    color: "#9CA3AF"
  },
  {
    icon: <SmartToy sx={{ fontSize: 40 }} />,
    value: 50,
    suffix: "+",
    label: "AI Health Features",
    color: "#6B7280"
  },
  {
    icon: <Analytics sx={{ fontSize: 40 }} />,
    value: 24,
    suffix: "/7",
    label: "AI Support Available",
    color: "#1E40AF"
  }
];

function AnimatedCounter({ value, suffix, trigger }: { value: number; suffix: string; trigger: number }) {
  const [count, setCount] = useState(0);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted) return;
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value, hasMounted, trigger]);

  const displayValue = hasMounted ? count : value;

  return (
    <Typography variant="h3" fontWeight={800} sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
      {displayValue.toFixed(suffix === "%" ? 1 : 0)}
      <Typography variant="h4" component="span" fontWeight={700}>
        {suffix}
      </Typography>
    </Typography>
  );
}

export default function StatsSection() {
  const { ref, inView } = useInView({ triggerOnce: false, threshold: 0.3 });
  const [trigger, setTrigger] = useState(0);

  useEffect(() => {
    if (inView) {
      setTrigger(t => t + 1);
    }
  }, [inView]);

  return (
    <Box ref={ref} sx={{ py: 8, background: 'linear-gradient(135deg, #FAFBFC 0%, #F3F4F6 100%)' }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: 3 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography 
            variant="h3" 
            textAlign="center" 
            fontWeight={700} 
            sx={{ mb: 6, color: 'text.primary' }}
          >
            Health AI by the Numbers
          </Typography>
        </motion.div>

        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
          gap: 4 
        }}>
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  textAlign: 'center',
                  background: 'white',
                  borderRadius: 4,
                  border: '1px solid rgba(0,0,0,0.04)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
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
                    background: `linear-gradient(135deg, ${stat.color}20, ${stat.color}40)`,
                    color: stat.color,
                    mb: 3,
                  }}
                >
                  {stat.icon}
                </Box>
                
                <AnimatedCounter value={stat.value} suffix={stat.suffix} trigger={trigger} />
                
                <Typography 
                  variant="h6" 
                  sx={{ 
                    mt: 1, 
                    color: 'text.secondary',
                    fontWeight: 500 
                  }}
                >
                  {stat.label}
                </Typography>
              </Paper>
            </motion.div>
          ))}
        </Box>
      </Box>
    </Box>
  );
} 