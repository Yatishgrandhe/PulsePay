"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Button, 
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  Grid
} from "@mui/material";
import { 
  CameraAlt, 
  ArrowBack, 
  CheckCircle,
  Error,
  Warning,
  Info,
  Videocam,
  VideocamOff,
  Refresh
} from "@mui/icons-material";
import { motion } from "framer-motion";
import Link from "next/link";
import AnimatedLogo from "@/components/AnimatedLogo";

interface PostureAnalysis {
  score: number;
  status: "good" | "fair" | "poor";
  feedback: string[];
  recommendations: string[];
}

export default function PostureCheckPage() {
  const [cameraPermission, setCameraPermission] = useState<"granted" | "denied" | "pending">("pending");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<PostureAnalysis | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const requestCameraPermission = async () => {
    try {
      setCameraPermission("pending");
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraOn(true);
        setCameraPermission("granted");
      }
    } catch (error) {
      console.error("Camera permission denied:", error);
      setCameraPermission("denied");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraOn(false);
  };

  const analyzePosture = async () => {
    if (!isCameraOn) return;

    setIsAnalyzing(true);
    
    // Simulate posture analysis (replace with actual computer vision API)
    setTimeout(() => {
      const randomScore = Math.floor(Math.random() * 40) + 60; // 60-100
      let status: "good" | "fair" | "poor";
      let feedback: string[];
      let recommendations: string[];

      if (randomScore >= 85) {
        status = "good";
        feedback = [
          "Excellent posture! Your spine is well-aligned",
          "Shoulders are properly positioned",
          "Head is in a neutral position"
        ];
        recommendations = [
          "Maintain this posture throughout the day",
          "Take regular breaks to stretch",
          "Continue with your current routine"
        ];
      } else if (randomScore >= 70) {
        status = "fair";
        feedback = [
          "Your posture is generally good with minor adjustments needed",
          "Slight forward head position detected",
          "Shoulders could be more relaxed"
        ];
        recommendations = [
          "Try to keep your head aligned with your spine",
          "Relax your shoulders and avoid hunching",
          "Consider ergonomic adjustments to your workspace"
        ];
      } else {
        status = "poor";
        feedback = [
          "Significant posture issues detected",
          "Forward head position is pronounced",
          "Shoulders are hunched forward"
        ];
        recommendations = [
          "Practice chin tucks to improve neck alignment",
          "Strengthen your core muscles",
          "Consider consulting a physical therapist",
          "Take frequent breaks to stretch and move"
        ];
      }

      setAnalysis({
        score: randomScore,
        status,
        feedback,
        recommendations
      });
      setIsAnalyzing(false);
    }, 3000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good": return "#4CAF50";
      case "fair": return "#FF9800";
      case "poor": return "#F44336";
      default: return "#9E9E9E";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "good": return <CheckCircle />;
      case "fair": return <Warning />;
      case "poor": return <Error />;
      default: return <Info />;
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <Box sx={{ minHeight: "100vh", background: "#f8f9ff" }}>
      {/* Header */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #7B61FF, #4CAF50)",
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
                  <CameraAlt sx={{ fontSize: 24 }} />
                  Posture Check
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "rgba(255, 255, 255, 0.8)",
                    fontSize: "0.8rem"
                  }}
                >
                  Real-time posture analysis
                </Typography>
              </Box>
            </Box>
            <Chip
              label={isCameraOn ? "Camera Active" : "Camera Off"}
              size="small"
              icon={isCameraOn ? <Videocam /> : <VideocamOff />}
              sx={{
                background: isCameraOn ? "rgba(76, 175, 80, 0.2)" : "rgba(255, 255, 255, 0.2)",
                color: "white",
                fontWeight: 500
              }}
            />
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {/* Camera Section */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Paper
                elevation={8}
                sx={{
                  borderRadius: 3,
                  overflow: "hidden",
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)"
                }}
              >
                {/* Camera Feed */}
                <Box
                  sx={{
                    position: "relative",
                    background: "#000",
                    aspectRatio: "4/3",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  {cameraPermission === "pending" && (
                    <Box sx={{ textAlign: "center", color: "white" }}>
                      <CircularProgress sx={{ color: "white", mb: 2 }} />
                      <Typography>Requesting camera permission...</Typography>
                    </Box>
                  )}

                  {cameraPermission === "denied" && (
                    <Box sx={{ textAlign: "center", color: "white", p: 3 }}>
                      <Error sx={{ fontSize: 48, mb: 2 }} />
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        Camera Access Required
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        Please allow camera access to analyze your posture
                      </Typography>
                      <Button
                        variant="contained"
                        onClick={requestCameraPermission}
                        sx={{
                          background: "linear-gradient(135deg, #7B61FF, #4CAF50)",
                          "&:hover": {
                            background: "linear-gradient(135deg, #6B51EF, #45A049)",
                          },
                        }}
                      >
                        Enable Camera
                      </Button>
                    </Box>
                  )}

                  {cameraPermission === "granted" && !isCameraOn && (
                    <Box sx={{ textAlign: "center", color: "white", p: 3 }}>
                      <CameraAlt sx={{ fontSize: 48, mb: 2 }} />
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        Camera Ready
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        Click start to begin posture analysis
                      </Typography>
                      <Button
                        variant="contained"
                        onClick={requestCameraPermission}
                        sx={{
                          background: "linear-gradient(135deg, #7B61FF, #4CAF50)",
                          "&:hover": {
                            background: "linear-gradient(135deg, #6B51EF, #45A049)",
                          },
                        }}
                      >
                        Start Camera
                      </Button>
                    </Box>
                  )}

                  {isCameraOn && (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover"
                      }}
                    />
                  )}

                  {isAnalyzing && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: "rgba(0, 0, 0, 0.7)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white"
                      }}
                    >
                      <Box sx={{ textAlign: "center" }}>
                        <CircularProgress sx={{ color: "white", mb: 2 }} />
                        <Typography variant="h6">Analyzing Posture...</Typography>
                        <Typography variant="body2">Please stay still</Typography>
                      </Box>
                    </Box>
                  )}
                </Box>

                {/* Camera Controls */}
                <Box sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={isCameraOn ? stopCamera : requestCameraPermission}
                      startIcon={isCameraOn ? <VideocamOff /> : <Videocam />}
                      sx={{
                        background: isCameraOn 
                          ? "linear-gradient(135deg, #F44336, #D32F2F)"
                          : "linear-gradient(135deg, #7B61FF, #4CAF50)",
                        "&:hover": {
                          background: isCameraOn 
                            ? "linear-gradient(135deg, #D32F2F, #B71C1C)"
                            : "linear-gradient(135deg, #6B51EF, #45A049)",
                        },
                      }}
                    >
                      {isCameraOn ? "Stop Camera" : "Start Camera"}
                    </Button>
                    <IconButton
                      onClick={requestCameraPermission}
                      disabled={!isCameraOn}
                      sx={{
                        background: "linear-gradient(135deg, #FF9800, #F57C00)",
                        color: "white",
                        "&:hover": {
                          background: "linear-gradient(135deg, #F57C00, #E65100)",
                        },
                        "&:disabled": {
                          background: "rgba(0, 0, 0, 0.12)",
                          color: "rgba(0, 0, 0, 0.38)",
                        },
                      }}
                    >
                      <Refresh />
                    </IconButton>
                  </Box>

                  <Button
                    fullWidth
                    variant="contained"
                    onClick={analyzePosture}
                    disabled={!isCameraOn || isAnalyzing}
                    sx={{
                      background: "linear-gradient(135deg, #E573B7, #7B61FF)",
                      "&:hover": {
                        background: "linear-gradient(135deg, #D563A7, #6B51EF)",
                      },
                      "&:disabled": {
                        background: "rgba(0, 0, 0, 0.12)",
                        color: "rgba(0, 0, 0, 0.38)",
                      },
                    }}
                  >
                    {isAnalyzing ? "Analyzing..." : "Analyze Posture"}
                  </Button>
                </Box>
              </Paper>
            </motion.div>
          </Grid>

          {/* Analysis Results */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {!analysis ? (
                <Paper
                  elevation={4}
                  sx={{
                    p: 4,
                    borderRadius: 3,
                    background: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center"
                  }}
                >
                  <CameraAlt sx={{ fontSize: 64, color: "#7B61FF", mb: 3 }} />
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                    Ready to Check Your Posture?
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Enable your camera and click &quot;Analyze Posture&quot; to get started. 
                    Make sure you&apos;re in a well-lit area and facing the camera.
                  </Typography>
                  <Alert severity="info" sx={{ borderRadius: 2 }}>
                    <Typography variant="body2">
                      <strong>Privacy Note:</strong> Your video is processed locally and not stored. 
                      We only analyze your posture in real-time.
                    </Typography>
                  </Alert>
                </Paper>
              ) : (
                <Paper
                  elevation={4}
                  sx={{
                    p: 4,
                    borderRadius: 3,
                    background: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)"
                  }}
                >
                  {/* Score Display */}
                  <Box sx={{ textAlign: "center", mb: 4 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                      Posture Score
                    </Typography>
                    <Box
                      sx={{
                        width: 120,
                        height: 120,
                        borderRadius: "50%",
                        background: `conic-gradient(${getStatusColor(analysis.status)} ${analysis.score * 3.6}deg, #f0f0f0 0deg)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mx: "auto",
                        mb: 2,
                        position: "relative"
                      }}
                    >
                      <Box
                        sx={{
                          width: 100,
                          height: 100,
                          borderRadius: "50%",
                          background: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexDirection: "column"
                        }}
                      >
                        <Typography variant="h3" sx={{ fontWeight: 700, color: getStatusColor(analysis.status) }}>
                          {analysis.score}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          / 100
                        </Typography>
                      </Box>
                    </Box>
                    <Chip
                      label={analysis.status.toUpperCase()}
                      icon={getStatusIcon(analysis.status)}
                      sx={{
                        background: `${getStatusColor(analysis.status)}20`,
                        color: getStatusColor(analysis.status),
                        fontWeight: 600,
                        fontSize: "1rem",
                        px: 2,
                        py: 1
                      }}
                    />
                  </Box>

                  {/* Feedback */}
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      Analysis Feedback
                    </Typography>
                    {analysis.feedback.map((item, index) => (
                      <Box key={index} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        <CheckCircle sx={{ color: "#4CAF50", mr: 1, fontSize: 20 }} />
                        <Typography variant="body2">{item}</Typography>
                      </Box>
                    ))}
                  </Box>

                  {/* Recommendations */}
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      Recommendations
                    </Typography>
                    {analysis.recommendations.map((item, index) => (
                      <Box key={index} sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: "#7B61FF",
                            mt: 0.5,
                            mr: 1,
                            flexShrink: 0
                          }}
                        />
                        <Typography variant="body2">{item}</Typography>
                      </Box>
                    ))}
                  </Box>

                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => setAnalysis(null)}
                    sx={{
                      mt: 3,
                      borderColor: "#7B61FF",
                      color: "#7B61FF",
                      "&:hover": {
                        borderColor: "#6B51EF",
                        background: "rgba(123, 97, 255, 0.05)",
                      },
                    }}
                  >
                    Analyze Again
                  </Button>
                </Paper>
              )}
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
} 