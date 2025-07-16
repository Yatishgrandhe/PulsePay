"use client";

import { motion } from "framer-motion";
import { Box } from "@mui/material";

interface AnimatedLogoProps {
  size?: number;
  variant?: "default" | "compact" | "hero";
  showWhiteCircle?: boolean;
}

export default function AnimatedLogo({ 
  size = 80, 
  variant = "default",
  showWhiteCircle = true 
}: AnimatedLogoProps) {
  const pulseAnimation = {
    scale: [1, 1.1, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut" as const
      }
  };

  const logoColors = {
    blue: "#1E3A8A",
    lightBlue: "#3B82F6",
    silver: "#9CA3AF",
    darkSilver: "#6B7280"
  };

  if (variant === "compact") {
    return (
      <motion.div
        animate={pulseAnimation}
        style={{ display: "inline-block" }}
      >
        <Box
          sx={{
            width: size,
            height: size,
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          {/* Medical Cross */}
          <Box
            sx={{
              width: size * 0.8,
              height: size * 0.8,
              position: "relative",
              "&::before, &::after": {
                content: '""',
                position: "absolute",
                background: logoColors.blue,
                borderRadius: "4px"
              },
              "&::before": {
                width: size * 0.2,
                height: size * 0.8,
                left: "50%",
                top: 0,
                transform: "translateX(-50%)"
              },
              "&::after": {
                width: size * 0.8,
                height: size * 0.2,
                left: 0,
                top: "50%",
                transform: "translateY(-50%)"
              }
            }}
          />
          
          {/* AI Chip overlay */}
          <Box
            sx={{
              position: "absolute",
              right: size * 0.1,
              top: size * 0.1,
              width: size * 0.3,
              height: size * 0.3,
              background: logoColors.silver,
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: size * 0.15,
              fontWeight: "bold",
              color: logoColors.blue,
              border: `2px solid ${logoColors.blue}`
            }}
          >
            AI
          </Box>
        </Box>
      </motion.div>
    );
  }

  return (
    <motion.div
      animate={pulseAnimation}
      style={{ display: "inline-block" }}
    >
    <Box 
      sx={{ 
          width: size,
          height: size,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        {/* Background circle */}
        {showWhiteCircle && (
          <Box
            sx={{
              width: size,
              height: size,
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(10px)",
              border: "2px solid rgba(255, 255, 255, 0.3)",
              position: "absolute"
            }}
          />
        )}

        {/* Medical Cross */}
        <Box
          sx={{
            width: size * 0.7,
            height: size * 0.7,
            position: "relative",
            zIndex: 1,
            "&::before, &::after": {
              content: '""',
              position: "absolute",
              background: logoColors.blue,
              borderRadius: "4px"
            },
            "&::before": {
              width: size * 0.15,
              height: size * 0.7,
              left: "50%",
              top: 0,
              transform: "translateX(-50%)"
            },
            "&::after": {
              width: size * 0.7,
              height: size * 0.15,
              left: 0,
              top: "50%",
              transform: "translateY(-50%)"
            }
          }}
        />

        {/* Caduceus Symbol */}
        <Box
          sx={{
            position: "absolute",
            width: size * 0.4,
            height: size * 0.6,
            zIndex: 2,
            "&::before": {
              content: '""',
              position: "absolute",
              width: size * 0.02,
              height: size * 0.5,
              background: logoColors.blue,
              left: "50%",
              top: size * 0.05,
              transform: "translateX(-50%)"
            },
            "&::after": {
              content: '""',
              position: "absolute",
              width: size * 0.15,
              height: size * 0.15,
              background: logoColors.blue,
              borderRadius: "50%",
              left: "50%",
              top: 0,
              transform: "translateX(-50%)"
            }
          }}
          />
        
        {/* AI Chip */}
        <Box
          sx={{
            position: "absolute",
            right: size * 0.05,
            top: size * 0.05,
            width: size * 0.25,
            height: size * 0.25,
            background: logoColors.silver,
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: size * 0.12,
            fontWeight: "bold",
            color: logoColors.blue,
            border: `2px solid ${logoColors.blue}`,
            zIndex: 3
          }}
        >
          AI
        </Box>
        
        {/* Pulse rings */}
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0, 0.2]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0
          }}
          style={{
            position: "absolute",
            width: size,
            height: size,
            border: `2px solid ${logoColors.lightBlue}`,
            borderRadius: "50%",
            pointerEvents: "none"
            }}
          />
        
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.1, 0, 0.1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
          style={{
            position: "absolute",
            width: size,
            height: size,
            border: `1px solid ${logoColors.blue}`,
            borderRadius: "50%",
            pointerEvents: "none"
          }}
        />
      </Box>
        </motion.div>
  );
}