"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { 
  Box, 
  Typography, 
  Button, 
  IconButton,
  TextField,
  Avatar,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider
} from "@mui/material";
import { 
  Send, 
  Psychology, 
  Add,
  Delete,
  Chat,
  Mic,
  GraphicEq,
  ArrowBack
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// Type declaration for Web Speech API
declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [chatToDelete, setChatToDelete] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isVoiceChat, setIsVoiceChat] = useState(false);
  const [transcript, setTranscript] = useState("");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          }
        }
        
        if (finalTranscript) {
          setTranscript(prev => prev + finalTranscript);
        }
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [isVoiceChat]);

  const handleVoiceMessage = useCallback((message: string) => {
    if (!currentChat) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: "user",
      timestamp: new Date()
    };

    // Update chat with user message
    const updatedChat = {
      ...currentChat,
      messages: [...currentChat.messages, userMessage],
      title: currentChat.messages.length === 0 ? message.slice(0, 30) + "..." : currentChat.title,
      updatedAt: new Date()
    };

    setCurrentChat(updatedChat);
    setChatSessions(prev => 
      prev.map(chat => 
        chat.id === updatedChat.id ? updatedChat : chat
      )
    );

    // Generate AI response
    generateResponse(message);
  }, [currentChat]);

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
    setInputText("");
    
    // Focus on input after creating new chat
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const selectChat = (chat: ChatSession) => {
    setCurrentChat(chat);
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
      setChatSessions(prev => 
        prev.map(chat => 
          chat.id === updatedChat.id ? updatedChat : chat
        )
      );

    } catch (error) {
      console.error('Error generating response:', error);
      
      // Fallback message
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
      setChatSessions(prev => 
        prev.map(chat => 
          chat.id === updatedChat.id ? updatedChat : chat
        )
      );
    } finally {
      setLoading(false);
      setIsTyping(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || !currentChat || loading) return;

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
    setChatSessions(prev => 
      prev.map(chat => 
        chat.id === updatedChat.id ? updatedChat : chat
      )
    );

    setInputText("");
    
    // Generate AI response
    await generateResponse(userMessage.text);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
      setTranscript("");
    }
  };

  const toggleVoiceChat = () => {
    setIsVoiceChat(!isVoiceChat);
    if (isVoiceChat && isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }
  };



  return (
    <Box sx={{ 
      height: "100vh", 
      display: "flex", 
      background: "#f7f7f8",
      position: "relative"
    }}>
      {/* Top Bar */}
      <Box sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "48px",
        background: "linear-gradient(135deg, #E573B7, #7B61FF)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 3,
        zIndex: 1100
      }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Psychology sx={{ fontSize: 20, color: "white" }} />
          <Typography variant="h6" sx={{ color: "white", fontWeight: 600 }}>
            Therapist Chat
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Link href="/health-tools" passHref>
            <IconButton
              sx={{
                color: "white",
                "&:hover": {
                  background: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              <ArrowBack />
            </IconButton>
          </Link>
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
              textTransform: "none",
              fontWeight: 500
            }}
          >
            New Chat
          </Button>
        </Box>
      </Box>

      {/* Sidebar - Always visible like ChatGPT */}
      <Box
        sx={{
          position: "fixed",
          left: 0,
          top: "48px",
          height: "calc(100vh - 48px)",
          width: "260px",
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          borderRight: "1px solid rgba(255, 255, 255, 0.2)",
          display: "flex",
          flexDirection: "column",
          zIndex: 1000
        }}
      >
        {/* New Chat Button */}
        <Box sx={{ p: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<Add />}
            onClick={createNewChat}
            sx={{
              borderColor: "rgba(123, 97, 255, 0.3)",
              color: "#7B61FF",
              "&:hover": {
                borderColor: "#7B61FF",
                background: "rgba(123, 97, 255, 0.1)",
              },
              py: 1.5,
              borderRadius: 1,
              textTransform: "none",
              fontWeight: 500,
              justifyContent: "flex-start"
            }}
          >
            New chat
          </Button>
        </Box>
        
        <Divider sx={{ borderColor: "rgba(123, 97, 255, 0.2)", mx: 2 }} />
        
        {/* Chat History */}
        <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: "#7B61FF", 
              fontSize: "12px", 
              fontWeight: 600, 
              mb: 2, 
              px: 1 
            }}
          >
            CHATS
          </Typography>
          {chatSessions.map((chat) => (
                          <Box
                key={chat.id}
                onClick={() => selectChat(chat)}
                sx={{
                  p: 1.5,
                  borderRadius: 1,
                  mb: 1,
                  cursor: "pointer",
                  background: currentChat?.id === chat.id ? "rgba(123, 97, 255, 0.1)" : "transparent",
                  "&:hover": {
                    background: "rgba(123, 97, 255, 0.1)",
                  },
                  display: "flex",
                  alignItems: "center",
                  gap: 1
                }}
              >
                <Chat sx={{ fontSize: 16, color: "#7B61FF" }} />
                <Typography
                  variant="body2"
                  sx={{
                    color: "#333",
                    fontWeight: currentChat?.id === chat.id ? 600 : 400,
                    flex: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    fontSize: "14px"
                  }}
                >
                  {chat.title}
                </Typography>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setChatToDelete(chat.id);
                    setDeleteDialogOpen(true);
                  }}
                  sx={{
                    color: "transparent",
                    p: 0.5,
                    "&:hover": {
                      color: "#f44336",
                      background: "rgba(244, 67, 54, 0.1)",
                    },
                  }}
                >
                  <Delete sx={{ fontSize: 14 }} />
                </IconButton>
              </Box>
          ))}
        </Box>


      </Box>

      {/* Main Chat Area */}
      <Box sx={{ 
        flex: 1, 
        display: "flex", 
        flexDirection: "column",
        ml: "260px",
        mt: "48px"
      }}>
        {/* Messages Area */}
        <Box sx={{ 
          flex: 1, 
          overflow: "auto", 
          background: "#ffffff",
          display: "flex",
          flexDirection: "column"
        }}>
          {!currentChat ? (
            <Box sx={{ 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center", 
              justifyContent: "center", 
              height: "100%",
              textAlign: "center",
              p: 4
            }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 600, 
                  mb: 2, 
                  color: "#ececf1",
                  fontSize: "32px"
                }}
              >
                What are you working on?
              </Typography>
            </Box>
                      ) : currentChat.messages.length === 0 ? (
            <Box sx={{ 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center", 
              justifyContent: "center", 
              height: "100%",
              textAlign: "center",
              p: 4
            }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 600, 
                  mb: 2, 
                  color: "#333",
                  fontSize: "32px"
                }}
              >
                What are you working on?
              </Typography>
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
                        gap: 3,
                        p: 4,
                        background: message.sender === "user" ? "#f7f7f8" : "#ffffff",
                        borderBottom: "1px solid #e5e5e5"
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 30,
                          height: 30,
                          background: message.sender === "user" ? "#7B61FF" : "#10a37f",
                          color: "white",
                          fontSize: "14px",
                          flexShrink: 0
                        }}
                      >
                        {message.sender === "user" ? "U" : "T"}
                      </Avatar>
                      <Box sx={{ flex: 1, maxWidth: "800px", mx: "auto" }}>
                        <Typography
                          variant="body1"
                          sx={{
                            lineHeight: 1.6,
                            color: "#374151",
                            whiteSpace: "pre-wrap",
                            fontSize: "16px"
                          }}
                        >
                          {message.text}
                        </Typography>
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
                  <Box
                    sx={{
                      display: "flex",
                      gap: 3,
                      p: 4,
                      background: "#ffffff",
                      borderBottom: "1px solid #e5e5e5"
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 30,
                        height: 30,
                        background: "#7B61FF",
                        color: "white",
                        fontSize: "14px",
                        flexShrink: 0
                      }}
                    >
                      T
                    </Avatar>
                    <Box sx={{ flex: 1, maxWidth: "800px", mx: "auto" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <CircularProgress size={16} sx={{ color: "#7B61FF" }} />
                        <Typography variant="body2" sx={{ color: "#666" }}>
                          Typing...
                        </Typography>
                      </Box>
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
              p: 4,
              background: "#ffffff",
              borderTop: "1px solid #e5e5e5"
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "flex-end",
                maxWidth: "800px",
                mx: "auto",
                position: "relative"
              }}
            >

                              <TextField
                  ref={inputRef}
                  fullWidth
                  multiline
                  maxRows={4}
                  value={isListening ? transcript : inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={isListening ? "Listening..." : "Ask anything"}
                  variant="outlined"
                  disabled={loading || isListening}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                      background: isListening ? "#fff3e0" : "#ffffff",
                      border: isListening ? "1px solid #ff9800" : "1px solid #e5e5e5",
                      pl: 8,
                      pr: 8,
                      "&:hover": {
                        borderColor: "#7B61FF",
                      },
                      "&.Mui-focused": {
                        borderColor: "#7B61FF",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#7B61FF",
                        },
                      },
                      "& .MuiInputBase-input": {
                        color: "#333",
                        "&::placeholder": {
                          color: isListening ? "#ff9800" : "#666",
                          opacity: 1
                        }
                      }
                    },
                  }}
                />
              <Box sx={{
                position: "absolute",
                right: 12,
                top: 12,
                display: "flex",
                alignItems: "center",
                gap: 1
              }}>
                <IconButton
                  onClick={toggleVoiceInput}
                  size="small"
                  sx={{
                    color: isListening ? "#f44336" : "#666",
                    p: 0.5,
                    "&:hover": {
                      color: isListening ? "#f44336" : "#7B61FF",
                    },
                  }}
                >
                  <Mic sx={{ fontSize: 16 }} />
                </IconButton>
                <IconButton
                  onClick={toggleVoiceChat}
                  size="small"
                  sx={{
                    color: isVoiceChat ? "#7B61FF" : "#666",
                    p: 0.5,
                    "&:hover": {
                      color: "#7B61FF",
                    },
                  }}
                >
                  <GraphicEq sx={{ fontSize: 16 }} />
                </IconButton>
                <IconButton
                  onClick={isListening ? () => {
                    if (transcript.trim()) {
                      handleVoiceMessage(transcript);
                      setTranscript("");
                      recognitionRef.current?.stop();
                      setIsListening(false);
                    }
                  } : handleSendMessage}
                  disabled={(!inputText.trim() && !transcript.trim()) || loading}
                  size="small"
                  sx={{
                    color: (inputText.trim() || transcript.trim()) ? "#7B61FF" : "#666",
                    p: 0.5,
                    "&:hover": {
                      color: "#7B61FF",
                    },
                    "&:disabled": {
                      color: "#ccc",
                    },
                  }}
                >
                  <Send sx={{ fontSize: 16 }} />
                </IconButton>
              </Box>
            </Box>
          </Box>
        )}
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
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