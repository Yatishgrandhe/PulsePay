"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  TextField, 
  IconButton,
  Avatar,
  Chip,
  Alert,
  CircularProgress,
  Card,
  CardContent,
} from "@mui/material";
import { 
  Send, 
  ArrowBack, 
  Psychology, 
  Warning,
  Info,
  Security
} from "@mui/icons-material";
import { motion } from "framer-motion";
import Link from "next/link";
import AnimatedLogo from "@/components/AnimatedLogo";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

export default function TherapistChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm here to provide mental health support and guidance. How are you feeling today?",
      sender: "ai",
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setLoading(true);

    // Simulate AI response (replace with actual OpenRouter API call)
    setTimeout(() => {
      const aiResponses = [
        "I understand how you're feeling. It's completely normal to experience these emotions. Can you tell me more about what's been on your mind?",
        "Thank you for sharing that with me. It sounds like you're going through a challenging time. What do you think might help you feel better?",
        "I hear you, and your feelings are valid. Sometimes talking about our struggles can help us process them better. Would you like to explore this further?",
        "That sounds really difficult. It's important to acknowledge your feelings and give yourself permission to feel them. What would be most helpful for you right now?",
        "I appreciate you opening up to me. It takes courage to share our struggles. Let's work together to find some strategies that might help you."
      ];

      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        sender: "ai",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", background: "#f8f9ff" }}>
      {/* Header */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #E573B7, #7B61FF)",
          py: 3,
          position: "sticky",
          top: 0,
          zIndex: 1000
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Link href="/health-tools" passHref>
                <IconButton
                  sx={{
                    color: "white",
                    mr: 2,
                    "&:hover": {
                      background: "rgba(255, 255, 255, 0.1)",
                      transform: "translateX(-2px)",
                    },
                    transition: "all 0.3s ease"
                  }}
                >
                  <ArrowBack />
                </IconButton>
              </Link>
              <AnimatedLogo size={40} variant="compact" showWhiteCircle={false} />
              <Box sx={{ ml: 2 }}>
                <Typography
                  variant="h6"
                  sx={{
                    color: "white",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    gap: 1
                  }}
                >
                  <Psychology sx={{ fontSize: 24 }} />
                  Therapist Chat
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "rgba(255, 255, 255, 0.8)",
                    fontSize: "0.8rem"
                  }}
                >
                  AI-powered mental health support
                </Typography>
              </Box>
            </Box>
            <Chip
              label="24/7 Available"
              size="small"
              sx={{
                background: "rgba(255, 255, 255, 0.2)",
                color: "white",
                fontWeight: 500
              }}
            />
          </Box>
        </Container>
      </Box>

      {/* Disclaimer */}
      <Container maxWidth="lg" sx={{ py: 2 }}>
        <Alert
          severity="info"
          icon={<Info />}
          sx={{
            borderRadius: 2,
            mb: 2,
            "& .MuiAlert-message": {
              fontSize: "0.9rem"
            }
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
            Important: This is an AI-powered support tool, not a replacement for professional therapy.
          </Typography>
          <Typography variant="body2" sx={{ fontSize: "0.85rem" }}>
            If you&apos;re experiencing a crisis or need immediate help, please contact emergency services or a mental health professional.
          </Typography>
        </Alert>
      </Container>

      {/* Chat Interface */}
      <Container maxWidth="md" sx={{ py: 2 }}>
        <Paper
          elevation={8}
          sx={{
            height: "70vh",
            borderRadius: 3,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.2)"
          }}
        >
          {/* Messages Area */}
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              p: 3,
              background: "linear-gradient(180deg, #f8f9ff 0%, #ffffff 100%)"
            }}
          >
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: message.sender === "user" ? "flex-end" : "flex-start",
                    mb: 2
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: "70%",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 1,
                      flexDirection: message.sender === "user" ? "row-reverse" : "row"
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        background: message.sender === "ai" 
                          ? "linear-gradient(135deg, #E573B7, #7B61FF)"
                          : "linear-gradient(135deg, #7B61FF, #4CAF50)",
                        fontSize: "0.8rem"
                      }}
                    >
                      {message.sender === "ai" ? "AI" : "You"}
                    </Avatar>
                    <Paper
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        background: message.sender === "user" 
                          ? "linear-gradient(135deg, #7B61FF, #4CAF50)"
                          : "rgba(255, 255, 255, 0.9)",
                        color: message.sender === "user" ? "white" : "text.primary",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                        maxWidth: "100%"
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          lineHeight: 1.5,
                          wordBreak: "break-word"
                        }}
                      >
                        {message.text}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",
                          mt: 1,
                          opacity: 0.7,
                          fontSize: "0.7rem"
                        }}
                      >
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </Typography>
                    </Paper>
                  </Box>
                </Box>
              </motion.div>
            ))}
            
            {loading && (
              <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      background: "linear-gradient(135deg, #E573B7, #7B61FF)",
                      fontSize: "0.8rem"
                    }}
                  >
                    AI
                  </Avatar>
                  <Paper
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      background: "rgba(255, 255, 255, 0.9)",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)"
                    }}
                  >
                    <CircularProgress size={20} sx={{ color: "#7B61FF" }} />
                  </Paper>
                </Box>
              </Box>
            )}
            
            <div ref={messagesEndRef} />
          </Box>

          {/* Input Area */}
          <Box
            sx={{
              p: 3,
              borderTop: "1px solid rgba(0, 0, 0, 0.1)",
              background: "rgba(255, 255, 255, 0.95)"
            }}
          >
            <Box sx={{ display: "flex", gap: 2, alignItems: "flex-end" }}>
              <TextField
                fullWidth
                multiline
                maxRows={4}
                placeholder="Type your message here..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    background: "rgba(255, 255, 255, 0.8)",
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#7B61FF",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#7B61FF",
                      borderWidth: 2,
                    },
                  },
                }}
              />
              <IconButton
                onClick={handleSendMessage}
                disabled={!inputText.trim() || loading}
                sx={{
                  background: "linear-gradient(135deg, #E573B7, #7B61FF)",
                  color: "white",
                  p: 1.5,
                  "&:hover": {
                    background: "linear-gradient(135deg, #D563A7, #6B51EF)",
                    transform: "scale(1.05)",
                  },
                  "&:disabled": {
                    background: "rgba(0, 0, 0, 0.12)",
                    color: "rgba(0, 0, 0, 0.38)",
                  },
                  transition: "all 0.3s ease"
                }}
              >
                <Send />
              </IconButton>
            </Box>
          </Box>
        </Paper>
      </Container>

      {/* Features and Safety */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          <Box sx={{ width: { xs: '100%', md: '33.333%' }, mb: 3 }}>
            <Card sx={{ borderRadius: 3, height: "100%" }}>
              <CardContent sx={{ textAlign: "center", p: 3 }}>
                <Security sx={{ fontSize: 40, color: "#7B61FF", mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Private & Secure
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Your conversations are encrypted and kept confidential
                </Typography>
              </CardContent>
            </Card>
          </Box>
          <Box sx={{ width: { xs: '100%', md: '33.333%' }, mb: 3 }}>
            <Card sx={{ borderRadius: 3, height: "100%" }}>
              <CardContent sx={{ textAlign: "center", p: 3 }}>
                <Psychology sx={{ fontSize: 40, color: "#E573B7", mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  AI-Powered Support
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Advanced AI trained on mental health best practices
                </Typography>
              </CardContent>
            </Card>
          </Box>
          <Box sx={{ width: { xs: '100%', md: '33.333%' }, mb: 3 }}>
            <Card sx={{ borderRadius: 3, height: "100%" }}>
              <CardContent sx={{ textAlign: "center", p: 3 }}>
                <Warning sx={{ fontSize: 40, color: "#FF9800", mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Crisis Support
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Emergency contacts and crisis resources available
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Container>
    </Box>
  );
} 