"use client";

import { Box, Typography, Paper, Avatar } from '@mui/material';
import { motion } from 'framer-motion';
import { Star } from '@mui/icons-material';
interface Testimonial {
  name: string;
  role: string;
  company: string;
  avatar: string;
  text: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    name: "Dr. Sarah Chen",
    role: "Emergency Physician",
    company: "City General Hospital",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
    text: "PulsePay has revolutionized how we handle emergency payments. The speed and security are unmatched. It&rsquo;s literally saved lives in our ER.",
    rating: 5
  },
  {
    name: "Marcus Rodriguez",
    role: "Financial Director",
    company: "Global Health Network",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    text: "The AI verification system is incredible. We've reduced fraud by 99% while processing payments 10x faster than traditional methods.",
    rating: 5
  },
  {
    name: "Dr. Emily Watson",
    role: "Chief Medical Officer",
    company: "Rural Health Initiative",
    avatar: "https://images.unsplash.com/photo-1594824475544-3d0c0b0c0b0b?w=150&h=150&fit=crop&crop=face",
    text: "As a rural healthcare provider, PulsePay has been a game-changer. Our patients can now receive emergency funds instantly, even in remote areas.",
    rating: 5
  },
  {
    name: "James Thompson",
    role: "Operations Manager",
    company: "Emergency Response Team",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    text: "The real-time tracking and blockchain verification give us complete confidence. We've never had a payment issue in 2+ years of use.",
    rating: 5
  }
];

function StarRating({ rating }: { rating: number }) {
  return (
    <Box sx={{ display: 'flex', gap: 0.5, mb: 2 }}>
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          sx={{ 
            color: i < rating ? '#FFD166' : '#E5E7EB',
            fontSize: 20
          }} 
        />
      ))}
    </Box>
  );
}

export default function TestimonialsSection() {
  return (
    <Box sx={{ py: 8, background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)' }}>
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
            Trusted by Healthcare Professionals
          </Typography>
          <Typography 
            variant="h6" 
            textAlign="center" 
            sx={{ mb: 8, color: 'text.secondary', maxWidth: 600, mx: 'auto' }}
          >
            See what medical professionals and organizations are saying about PulsePay
          </Typography>
        </motion.div>

        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
          gap: 4 
        }}>
          {testimonials.map((testimonial, index) => (
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
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 32px rgba(0,0,0,0.1)',
                  }
                }}
              >
                <StarRating rating={testimonial.rating} />
                
                <Typography 
                  variant="body1" 
                  sx={{ 
                    mb: 3, 
                    color: 'text.secondary',
                    lineHeight: 1.7,
                    fontStyle: 'italic'
                  }}
                >
                  &ldquo;{testimonial.text}&rdquo;
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    sx={{ width: 56, height: 56 }}
                  />
                  <Box>
                    <Typography variant="h6" fontWeight={600} sx={{ color: 'text.primary' }}>
                      {testimonial.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {testimonial.role}, {testimonial.company}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </motion.div>
          ))}
        </Box>
      </Box>
    </Box>
  );
} 