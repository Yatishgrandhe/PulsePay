"use client";

import Image from 'next/image';
import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion';
import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

interface AnimatedLogoProps {
  size?: number;
  showText?: boolean;
  variant?: "default" | "hero" | "compact" | "floating" | "bounce" | "spin";
  interactive?: boolean;
  className?: string;
  theme?: "primary" | "modern" | "vibrant" | "elegant";
  showWhiteCircle?: boolean;
}

export default function AnimatedLogo({ 
  size = 120, 
  showText = false,
  variant = "default",
  interactive = true,
  className = "",
  theme = "modern",
  showWhiteCircle = false
}: AnimatedLogoProps) {
  const [isHovered, setIsHovered] = useState(false);
  const controls = useAnimation();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Subtle 3D effect - reduced for better performance
  const rotateX = useTransform(mouseY, [-size/2, size/2], [5, -5]);
  const rotateY = useTransform(mouseX, [-size/2, size/2], [-5, 5]);

  // Enhanced color schemes with better contrast
  const themes = {
    primary: {
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      glow: '#667eea',
    },
    modern: {
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      glow: '#667eea',
    },
    vibrant: {
      gradient: 'linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 50%, #45b7d1 100%)',
      glow: '#ff6b6b',
    },
    elegant: {
      gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      glow: '#a8edea',
    }
  };

  const currentTheme = themes[theme];

  // Optimized animation variants
  const logoVariants = {
    default: {
      scale: 1,
      rotate: 0,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 30
      }
    },
    hero: {
      scale: [1, 1.05, 1],
      y: [0, -3, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut" as const
      }
    },
    floating: {
      y: [0, -8, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut" as const
      }
    },
    bounce: {
      y: [0, -15, 0],
      scale: [1, 1.05, 1],
      transition: {
        duration: 1.2,
        repeat: Infinity,
        ease: "easeInOut" as const
      }
    },
    spin: {
      rotate: [0, 360],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "linear" as const
      }
    }
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!interactive) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(event.clientX - centerX);
    mouseY.set(event.clientY - centerY);
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    if (!interactive) return;
    setIsHovered(true);
  };

  useEffect(() => {
    if (isHovered && interactive) {
      controls.start({
        scale: 1.08,
        transition: { 
          type: "spring" as const,
          stiffness: 400,
          damping: 25
        }
      });
    } else {
      controls.start({
        scale: 1,
        transition: { 
          type: "spring" as const,
          stiffness: 400,
          damping: 25
        }
      });
    }
  }, [isHovered, interactive, controls]);

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        gap: 2,
        position: 'relative',
        cursor: interactive ? 'pointer' : 'default'
      }}
      className={className}
    >
      <motion.div
        className="relative flex items-center justify-center"
        style={{
          width: size + 60,
          height: size + 60,
          transformStyle: 'preserve-3d',
          rotateX: interactive ? rotateX : 0,
          rotateY: interactive ? rotateY : 0,
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        animate={controls}
      >
        {/* White circle background if requested */}
        {showWhiteCircle && (
          <motion.div
            className="absolute rounded-full"
            style={{
              background: 'white',
              width: size + 16,
              height: size + 16,
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 2,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            }}
            animate={{
              scale: isHovered ? 1.05 : 1,
              boxShadow: isHovered
                ? '0 8px 30px rgba(0,0,0,0.15)'
                : '0 4px 20px rgba(0,0,0,0.08)',
            }}
            transition={{ duration: 0.3 }}
          />
        )}
        
        {/* Logo image - positioned exactly where the shapes were */}
        <motion.div
          className="relative z-20"
          style={{
            width: size,
            height: size,
            borderRadius: '50%',
            overflow: 'hidden',
            background: 'transparent',
            boxShadow: isHovered 
              ? `0 0 30px ${currentTheme.glow}60, 0 8px 25px rgba(0, 0, 0, 0.15)`
              : `0 0 20px ${currentTheme.glow}40, 0 4px 15px rgba(0, 0, 0, 0.1)`,
            transition: 'box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          variants={logoVariants}
          animate={variant === "default" ? "default" : variant}
        >
          <Image
            src="/image.png"
            alt="PulsePay logo: heart with dollar and pulse line"
            width={size}
            height={size}
            priority
            className="w-full h-full object-contain"
            style={{ 
              borderRadius: '50%',
              background: 'transparent',
            }}
          />
        </motion.div>
      </motion.div>
      
      {/* Enhanced text with theme support */}
      {showText && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: 0.3, 
            duration: 0.6,
            ease: "easeOut" as const
          }}
        >
          <Typography 
            variant="h4" 
            fontWeight={700}
            sx={{
              background: currentTheme.gradient,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textAlign: 'center',
              filter: isHovered ? `drop-shadow(0 0 8px ${currentTheme.glow}40)` : 'none',
              transition: 'filter 0.3s ease',
              userSelect: 'none',
            }}
          >
            PulsePay
          </Typography>
        </motion.div>
      )}
    </Box>
  );
}