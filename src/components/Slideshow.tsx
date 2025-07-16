"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartPulse, Bot, Wallet, Shield, Rocket } from 'lucide-react';

const slides = [
  {
      title: 'AI-Powered Health Diagnostics',
  description: 'Advanced AI diagnostics and personalized health insights. Instant analysis, comprehensive care.',
    icon: <HeartPulse className="text-pulsepay-pink" size={48} aria-label="AI-Powered" />,
    bg: 'from-pulsepay-pink to-pulsepay-purple',
  },
  {
    title: 'ID & Fraud Checks with AI',
    description: 'Advanced OpenAI, Telesign, and IDAnalyzer integrations for real-time verification and fraud scoring.',
    icon: <Bot className="text-pulsepay-gold" size={48} aria-label="Fraud Check" />,
    bg: 'from-pulsepay-gold to-pulsepay-purple',
  },
  {
    title: 'Blockchain Payouts',
    description: 'Instant payouts on Base/Polygon testnet. Connect your wallet and get paid in seconds.',
    icon: <Wallet className="text-pulsepay-purple" size={48} aria-label="Wallet" />,
    bg: 'from-pulsepay-purple to-pulsepay-gold',
  },
  {
    title: 'Health & Fintech Synergy',
    description: 'Bridging health and finance for a safer, more resilient future. Built for hackathons and investors.',
    icon: <Shield className="text-pulsepay-blue" size={48} aria-label="Synergy" />,
    bg: 'from-pulsepay-blue to-pulsepay-pink',
  },
  {
    title: 'Built for Speed & Scale',
    description: 'PWA, mobile-ready, blazing fast. Try on web, install as app, or scan with Expo Go.',
    icon: <Rocket className="text-pulsepay-gold" size={48} aria-label="Speed" />,
    bg: 'from-pulsepay-gold to-pulsepay-pink',
  },
];

export default function Slideshow() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full max-w-2xl h-72 flex items-center justify-center overflow-hidden rounded-3xl shadow-xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          className={`absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br ${slides[index].bg} text-white p-8`}
        >
          <div className="mb-4">{slides[index].icon}</div>
          <h2 className="text-3xl font-heading font-bold mb-2 drop-shadow-lg animate-pulse">
            {slides[index].title}
          </h2>
          <p className="text-lg font-body text-white/90 max-w-md text-center animate-fadein">
            {slides[index].description}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
} 