"use client";

import { Box } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  size?: number;
  variant?: "default" | "compact" | "hero";
  showText?: boolean;
  href?: string;
}

export default function Logo({ 
  size = 80, 
  variant = "default",
  showText = true,
  href = "/"
}: LogoProps) {
  const logoSize = variant === "compact" ? size * 0.8 : size;
  const textSize = variant === "compact" ? "1.25rem" : "1.5rem";

  const LogoContent = () => (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 2,
      cursor: 'pointer'
    }}>
      <Box sx={{ 
        position: 'relative',
        width: logoSize,
        height: logoSize,
        borderRadius: variant === "compact" ? "8px" : "12px",
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(30, 58, 138, 0.2)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: '0 6px 25px rgba(30, 58, 138, 0.3)',
        }
      }}>
        <Image
          src="/image copy.png"
          alt="Health AI Logo"
          fill
          style={{ 
            objectFit: 'cover',
            borderRadius: variant === "compact" ? "8px" : "12px"
          }}
          priority
        />
      </Box>
      
      {showText && (
        <Box sx={{ 
          color: 'white',
          fontWeight: 700,
          fontSize: textSize,
          letterSpacing: '-0.5px',
          display: { xs: 'none', sm: 'block' }
        }}>
          Health AI
        </Box>
      )}
    </Box>
  );

  if (href) {
    return (
      <Link href={href} style={{ textDecoration: 'none' }}>
        <LogoContent />
      </Link>
    );
  }

  return <LogoContent />;
} 