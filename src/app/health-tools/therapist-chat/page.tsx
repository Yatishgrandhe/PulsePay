"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Button, 
  IconButton,
  TextField,
  Avatar,
  CircularProgress,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import { 
  Send, 
  Psychology, 
  ArrowBack,
  Add,
  Delete,
  Chat
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import AnimatedLogo from "@/components/AnimatedLogo";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
  isTyping?: boolean;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export default function TherapistChatPage() {
  const [currentChat, setCurrentChat] = useState<ChatSession | null>(null);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [chatToDelete, setChatToDelete] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load chats from localStorage on component mount
  useEffect(() => {
    const savedChats = localStorage.getItem('therapist-chats');
    if (savedChats) {
      const parsedChats = JSON.parse(savedChats).map((chat: ChatSession) => ({
        ...chat,
        createdAt: new Date(chat.createdAt),
        updatedAt: new Date(chat.updatedAt),
        messages: chat.messages.map((msg: Message) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      }));
      setChatSessions(parsedChats);
      
      // Load the most recent chat
      if (parsedChats.length > 0) {
        setCurrentChat(parsedChats[0]);
      }
    }
  }, []);

  // Save chats to localStorage whenever they change
  useEffect(() => {
    if (chatSessions.length > 0) {
      localStorage.setItem('therapist-chats', JSON.stringify(chatSessions));
    }
  }, [chatSessions]);

  // Scroll to bottom when new messages are added (but not during typing)
  useEffect(() => {
    if (currentChat?.messages.length && !isTyping) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [currentChat?.messages, isTyping]);

  // Don't scroll during typing - let user maintain their position
  useEffect(() => {
    if (isTyping) {
      // Don't scroll during typing - let user maintain their position
      return;
    }
  }, [isTyping]);

  const createNewChat = () => {
    const newChat: ChatSession = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setChatSessions(prev => [newChat, ...prev]);
    setCurrentChat(newChat);
    setSidebarOpen(false);
    setInputText("");
    
    // Focus on input after creating new chat
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const selectChat = (chat: ChatSession) => {
    setCurrentChat(chat);
    setSidebarOpen(false);
    setInputText("");
  };

  const deleteChat = (chatId: string) => {
    setChatSessions(prev => prev.filter(chat => chat.id !== chatId));
    if (currentChat?.id === chatId) {
      setCurrentChat(chatSessions.find(chat => chat.id !== chatId) || null);
    }
    setDeleteDialogOpen(false);
    setChatToDelete(null);
  };

  const generateResponse = async (userMessage: string) => {
    if (!currentChat) return;

    setLoading(true);
    setIsTyping(true);

    try {
      // Simple message for friendly chat
      const enhancedPrompt = `The user has shared: "${userMessage}"

Please respond like a caring, supportive friend who's here to listen and chat. Be warm, friendly, and genuinely helpful. Keep your response short and sweet (1-2 sentences max). Use casual, everyday language - no fancy talk, just being a good friend. Be encouraging and positive, especially when they're having a tough time.`;

      // Simulate API call with typing effect
      const response = await fetch('/api/therapist-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: enhancedPrompt,
          conversationHistory: currentChat.messages.slice(-5) // Last 5 messages for context
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      // Simulate typing effect
      const aiMessage: Message = {
        id: Date.now().toString(),
        text: data.response || "Hey, I totally get how you're feeling right now. It's totally okay to feel this way, and I'm here to listen and chat with you!",
        sender: "ai",
        timestamp: new Date()
      };

      // Update chat with new messages
      const updatedChat = {
        ...currentChat,
        messages: [...currentChat.messages, aiMessage],
        title: currentChat.messages.length === 0 ? userMessage.slice(0, 30) + "..." : currentChat.title,
        updatedAt: new Date()
      };

      setCurrentChat(updatedChat);
      setChatSessions(prev => prev.map(chat => 
        chat.id === currentChat.id ? updatedChat : chat
      ));

    } catch (error) {
      console.error('Error generating response:', error);
      
      // Fallback response
      const fallbackMessage: Message = {
        id: Date.now().toString(),
        text: "Oops! I'm having a little trouble connecting right now, but don't worry - I'm still here for you! Maybe try calling a friend or doing something that makes you smile?",
        sender: "ai",
        timestamp: new Date()
      };

      const updatedChat = {
        ...currentChat,
        messages: [...currentChat.messages, fallbackMessage],
        updatedAt: new Date()
      };

      setCurrentChat(updatedChat);
      setChatSessions(prev => prev.map(chat => 
        chat.id === currentChat.id ? updatedChat : chat
      ));
    } finally {
      setLoading(false);
      setIsTyping(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || loading || !currentChat) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: "user",
      timestamp: new Date()
    };

    // Update chat with user message
    const updatedChat = {
      ...currentChat,
      messages: [...currentChat.messages, userMessage],
      title: currentChat.messages.length === 0 ? inputText.slice(0, 30) + "..." : currentChat.title,
      updatedAt: new Date()
    };

    setCurrentChat(updatedChat);
    setChatSessions(prev => prev.map(chat => 
      chat.id === currentChat.id ? updatedChat : chat
    ));

    setInputText("");
    
    // Generate AI response
    await generateResponse(inputText.trim());
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return 'Today';
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return `${days} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", background: "#f8f9ff" }}>
      {/* Header */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #E573B7, #7B61FF)",
          py: 2,
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
                  Friendly Chat Support
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "rgba(255, 255, 255, 0.8)",
                    fontSize: "0.8rem"
                  }}
                >
                  Talk to a caring friend who&apos;s here to listen
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={createNewChat}
                sx={{
                  borderColor: "rgba(255, 255, 255, 0.3)",
                  color: "white",
                  "&:hover": {
                    borderColor: "white",
                    background: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                New Chat
              </Button>
              <IconButton
                onClick={() => setSidebarOpen(true)}
                sx={{
                  color: "white",
                  "&:hover": {
                    background: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                <Chat />
              </IconButton>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Main Chat Area */}
      <Container maxWidth="lg" sx={{ py: 2, height: "calc(100vh - 120px)" }}>
        <Paper
          elevation={8}
          sx={{
            height: "100%",
            borderRadius: 3,
            overflow: "hidden",
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            display: "flex",
            flexDirection: "column"
          }}
        >
          {/* Messages Area */}
          <Box
            sx={{
              flex: 1,
              overflow: "auto",
              p: 3,
              display: "flex",
              flexDirection: "column",
              gap: 2
            }}
          >
            {!currentChat ? (
              <Box sx={{ 
                display: "flex", 
                flexDirection: "column", 
                alignItems: "center", 
                justifyContent: "center", 
                height: "100%",
                textAlign: "center"
              }}>
                <Psychology sx={{ fontSize: 64, color: "#7B61FF", mb: 3 }} />
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                  Welcome to Friendly Chat Support
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: "500px" }}>
                  Start a new conversation to chat with a caring friend who&apos;s here to listen, 
                  offer support, and help you feel better.
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={createNewChat}
                  sx={{
                    background: "linear-gradient(135deg, #E573B7, #7B61FF)",
                    "&:hover": {
                      background: "linear-gradient(135deg, #D563A7, #6B51EF)",
                    },
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    textTransform: "none"
                  }}
                >
                  Start New Chat
                </Button>
              </Box>
            ) : currentChat.messages.length === 0 ? (
              // Show helpful tips before first message
              <Box sx={{ 
                display: "flex", 
                flexDirection: "column", 
                alignItems: "center", 
                justifyContent: "center", 
                height: "100%",
                textAlign: "center",
                p: 3
              }}>
                <Psychology sx={{ fontSize: 48, color: "#7B61FF", mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Ready to Chat
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: "400px" }}>
                  Share what&apos;s on your mind. I&apos;m here to listen, chat, and help you feel better.
                </Typography>
                
                {/* Helpful Tips Cards */}
                <Box sx={{ 
                  display: "flex", 
                  flexWrap: "wrap", 
                  gap: 2, 
                  justifyContent: "center",
                  maxWidth: "600px"
                }}>
                  <Paper sx={{ 
                    p: 2, 
                    borderRadius: 2, 
                    background: "rgba(123, 97, 255, 0.1)",
                    border: "1px solid rgba(123, 97, 255, 0.2)",
                    minWidth: "150px"
                  }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: "#7B61FF" }}>
                      💡 Caring & Supportive
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Get friendly advice and emotional support
                    </Typography>
                  </Paper>
                  
                  <Paper sx={{ 
                    p: 2, 
                    borderRadius: 2, 
                    background: "rgba(229, 115, 183, 0.1)",
                    border: "1px solid rgba(229, 115, 183, 0.2)",
                    minWidth: "150px"
                  }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: "#E573B7" }}>
                      🛡️ Safe & Private
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Your conversations are confidential
                    </Typography>
                  </Paper>
                  
                  <Paper sx={{ 
                    p: 2, 
                    borderRadius: 2, 
                    background: "rgba(76, 175, 80, 0.1)",
                    border: "1px solid rgba(76, 175, 80, 0.2)",
                    minWidth: "150px"
                  }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: "#4CAF50" }}>
                      🎯 Helpful Ideas
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Simple things you can try to feel better
                    </Typography>
                  </Paper>
                </Box>
              </Box>
            ) : (
              <>
                <AnimatePresence>
                  {currentChat.messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: message.sender === "user" ? "flex-end" : "flex-start",
                          mb: 2,
                          px: { xs: 1, sm: 2 }
                        }}
                      >
                        <Box
                          sx={{
                            maxWidth: { xs: "90%", sm: "80%", md: "70%" },
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 2,
                            flexDirection: message.sender === "user" ? "row-reverse" : "row"
                          }}
                        >
                          <Avatar
                            sx={{
                              width: { xs: 32, sm: 40 },
                              height: { xs: 32, sm: 40 },
                              background: message.sender === "ai" 
                                ? "linear-gradient(135deg, #E573B7, #7B61FF)"
                                : "linear-gradient(135deg, #7B61FF, #4CAF50)",
                              fontSize: { xs: "0.8rem", sm: "0.9rem" },
                              flexShrink: 0
                            }}
                          >
                            {message.sender === "ai" ? "AI" : "You"}
                          </Avatar>
                          <Paper
                            sx={{
                              p: { xs: 2, sm: 3 },
                              borderRadius: 3,
                              background: message.sender === "user" 
                                ? "linear-gradient(135deg, #7B61FF, #4CAF50)"
                                : "rgba(255, 255, 255, 0.9)",
                              color: message.sender === "user" ? "white" : "text.primary",
                              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                              maxWidth: "100%",
                              wordBreak: "break-word"
                            }}
                          >
                            <Typography
                              variant="body1"
                              sx={{
                                lineHeight: 1.6,
                                whiteSpace: "pre-wrap",
                                fontSize: { xs: "0.9rem", sm: "1rem" }
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
                                fontSize: "0.75rem"
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
                </AnimatePresence>
                
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 2, px: { xs: 1, sm: 2 } }}>
                      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                        <Avatar
                          sx={{
                            width: { xs: 32, sm: 40 },
                            height: { xs: 32, sm: 40 },
                            background: "linear-gradient(135deg, #E573B7, #7B61FF)",
                            fontSize: { xs: "0.8rem", sm: "0.9rem" }
                          }}
                        >
                          AI
                        </Avatar>
                        <Paper
                          sx={{
                            p: { xs: 2, sm: 3 },
                            borderRadius: 3,
                            background: "rgba(255, 255, 255, 0.9)",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                            display: "flex",
                            alignItems: "center",
                            gap: 2
                          }}
                        >
                          <CircularProgress size={20} sx={{ color: "#7B61FF" }} />
                          <Typography variant="body2" color="text.secondary">
                            AI is thinking...
                          </Typography>
                        </Paper>
                      </Box>
                    </Box>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </>
            )}
          </Box>

          {/* Input Area */}
          {currentChat && (
            <Box
              sx={{
                p: 3,
                borderTop: "1px solid rgba(0, 0, 0, 0.1)",
                background: "rgba(255, 255, 255, 0.95)"
              }}
            >
              <Box sx={{ display: "flex", gap: 2, alignItems: "flex-end" }}>
                <TextField
                  ref={inputRef}
                  fullWidth
                  multiline
                  maxRows={4}
                  placeholder="Share what's on your mind... I'm here to help with research-based insights and practical strategies."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={loading || isTyping}
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
                  disabled={!inputText.trim() || loading || isTyping}
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
          )}
        </Paper>
      </Container>

      {/* Chat History Sidebar */}
      <Drawer
        anchor="left"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: 320,
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.2)"
          }
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Chat History
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={createNewChat}
              sx={{
                background: "linear-gradient(135deg, #E573B7, #7B61FF)",
                "&:hover": {
                  background: "linear-gradient(135deg, #D563A7, #6B51EF)",
                },
                borderRadius: 2,
                textTransform: "none"
              }}
            >
              New
            </Button>
          </Box>
          
          <List sx={{ p: 0 }}>
            {chatSessions.map((chat) => (
              <ListItem
                key={chat.id}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  background: currentChat?.id === chat.id ? "rgba(123, 97, 255, 0.1)" : "transparent",
                  "&:hover": {
                    background: "rgba(123, 97, 255, 0.05)",
                  },
                  cursor: "pointer"
                }}
                onClick={() => selectChat(chat)}
              >
                <ListItemIcon>
                  <Chat sx={{ color: "#7B61FF" }} />
                </ListItemIcon>
                <ListItemText
                  primary={chat.title}
                  secondary={formatDate(chat.updatedAt)}
                  primaryTypographyProps={{
                    sx: { fontWeight: currentChat?.id === chat.id ? 600 : 400 }
                  }}
                />
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setChatToDelete(chat.id);
                    setDeleteDialogOpen(true);
                  }}
                  sx={{
                    color: "#F44336",
                    "&:hover": {
                      background: "rgba(244, 67, 54, 0.1)",
                    }
                  }}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Chat</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this chat? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={() => chatToDelete && deleteChat(chatToDelete)}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 