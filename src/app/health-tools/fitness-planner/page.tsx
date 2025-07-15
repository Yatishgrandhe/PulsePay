"use client";

import { useState } from "react";
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Button, 
  IconButton,
  Card,
  CardContent,
  Chip,
  Alert,
  CircularProgress,
  Grid,
  FormControl,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Divider
} from "@mui/material";
import { 
  FitnessCenter, 
  ArrowBack, 
  CloudUpload,
  Restaurant,
  DirectionsRun,
  Save
} from "@mui/icons-material";
import { motion } from "framer-motion";
import Link from "next/link";
import AnimatedLogo from "@/components/AnimatedLogo";

interface FitnessPlan {
  id: string;
  name: string;
  duration: number;
  difficulty: string;
  goals: string[];
  meals: {
    breakfast: string[];
    lunch: string[];
    dinner: string[];
  };
  workouts: {
    cardio: string[];
    strength: string[];
    flexibility: string[];
  };
  progress: {
    currentDay: number;
    completedWorkouts: number;
    completedMeals: number;
  };
}

type DietaryPreference = "vegetarian" | "non-vegetarian" | "vegan";

const steps = [
  "Upload Body Image",
  "Select Dietary Preferences", 
  "Review Your Plan",
  "Start Your Journey"
];

export default function FitnessPlannerPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [dietaryPreference, setDietaryPreference] = useState<DietaryPreference>("vegetarian");
  const [fitnessGoals, setFitnessGoals] = useState<string[]>([]);

  const [plan, setPlan] = useState<FitnessPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setActiveStep(1);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDietaryChange = (preference: DietaryPreference) => {
    setDietaryPreference(preference);
  };

  const handleGoalChange = (goal: string) => {
    setFitnessGoals(prev => 
      prev.includes(goal) 
        ? prev.filter(g => g !== goal)
        : [...prev, goal]
    );
  };

  const generatePlan = async () => {
    setIsGenerating(true);
    
    // Simulate plan generation (replace with actual API calls)
    setTimeout(() => {
      const newPlan: FitnessPlan = {
        id: Date.now().toString(),
        name: "90-Day Wellness Journey",
        duration: 90,
        difficulty: "Intermediate",
        goals: fitnessGoals.length > 0 ? fitnessGoals : ["Weight Loss", "Muscle Tone", "Overall Fitness"],
        meals: {
          breakfast: [
            "Oatmeal with berries and nuts",
            "Greek yogurt with honey",
            "Whole grain toast with avocado",
            "Smoothie bowl with protein"
          ],
          lunch: [
            "Quinoa salad with vegetables",
            "Grilled chicken with brown rice",
            "Lentil soup with whole grain bread",
            "Tofu stir-fry with vegetables"
          ],
          dinner: [
            "Salmon with steamed vegetables",
            "Vegetarian pasta with tomato sauce",
            "Chickpea curry with rice",
            "Grilled vegetables with quinoa"
          ]
        },
        workouts: {
          cardio: [
            "30 minutes brisk walking",
            "20 minutes HIIT training",
            "45 minutes cycling",
            "15 minutes jump rope"
          ],
          strength: [
            "Push-ups and squats (3 sets each)",
            "Dumbbell exercises for arms",
            "Core strengthening exercises",
            "Bodyweight circuit training"
          ],
          flexibility: [
            "10 minutes stretching routine",
            "Yoga flow sequence",
            "Pilates exercises",
            "Mobility drills"
          ]
        },
        progress: {
          currentDay: 1,
          completedWorkouts: 0,
          completedMeals: 0
        }
      };
      
      setPlan(newPlan);
      setIsGenerating(false);
      setActiveStep(3);
    }, 3000);
  };

  const savePlan = () => {
    // Save plan to user's saved routines (implement with backend)
    alert("Plan saved to your routines!");
  };

  const availableGoals = [
    "Weight Loss",
    "Muscle Building", 
    "Cardiovascular Health",
    "Flexibility",
    "Strength Training",
    "Endurance",
    "Stress Relief",
    "Overall Fitness"
  ];

  return (
    <Box sx={{ minHeight: "100vh", background: "#f8f9ff" }}>
      {/* Header */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #FFD166, #06D6A0)",
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
                  <FitnessCenter sx={{ fontSize: 24 }} />
                  90-Day Fitness Planner
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "rgba(255, 255, 255, 0.8)",
                    fontSize: "0.8rem"
                  }}
                >
                  Personalized workout and nutrition plans
                </Typography>
              </Box>
            </Box>
            <Chip
              label="AI-Powered"
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

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4 }}>
          {/* Stepper */}
          <Box sx={{ width: { xs: "100%", md: "33.333%" } }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Paper
                elevation={4}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)"
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Your Journey
                </Typography>
                <Stepper activeStep={activeStep} orientation="vertical">
                  {steps.map((label, index) => (
                    <Step key={label}>
                      <StepLabel
                        sx={{
                          "& .MuiStepLabel-label": {
                            fontWeight: activeStep === index ? 600 : 400,
                            color: activeStep === index ? "#FFD166" : "text.secondary"
                          }
                        }}
                      >
                        {label}
                      </StepLabel>
                      <StepContent>
                        {index === 0 && (
                          <Typography variant="body2" color="text.secondary">
                            Upload a full-body image for AI analysis
                          </Typography>
                        )}
                        {index === 1 && (
                          <Typography variant="body2" color="text.secondary">
                            Choose your dietary preferences
                          </Typography>
                        )}
                        {index === 2 && (
                          <Typography variant="body2" color="text.secondary">
                            Review your personalized plan
                          </Typography>
                        )}
                        {index === 3 && (
                          <Typography variant="body2" color="text.secondary">
                            Start your 90-day journey
                          </Typography>
                        )}
                      </StepContent>
                    </Step>
                  ))}
                </Stepper>
              </Paper>
            </motion.div>
          </Grid>

          {/* Main Content */}
          <Grid item xs={12} md={8}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Paper
                elevation={8}
                sx={{
                  p: 4,
                  borderRadius: 3,
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  minHeight: "600px"
                }}
              >
                {/* Step 1: Image Upload */}
                {activeStep === 0 && (
                  <Box sx={{ textAlign: "center" }}>
                    <CloudUpload sx={{ fontSize: 64, color: "#FFD166", mb: 3 }} />
                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                      Upload Your Body Image
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                      Upload a full-body image for AI analysis. This helps us create a personalized fitness plan.
                    </Typography>
                    
                    <Button
                      variant="contained"
                      component="label"
                      sx={{
                        background: "linear-gradient(135deg, #FFD166, #06D6A0)",
                        "&:hover": {
                          background: "linear-gradient(135deg, #FFC107, #00C853)",
                        },
                        px: 4,
                        py: 1.5,
                        borderRadius: 3,
                        fontSize: "1.1rem",
                        fontWeight: 600,
                        textTransform: "none"
                      }}
                    >
                      Choose Image
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </Button>
                    
                    <Alert severity="info" sx={{ mt: 3, borderRadius: 2 }}>
                      <Typography variant="body2">
                        <strong>Privacy:</strong> Your image is processed locally and not stored. 
                        We only use it for body composition analysis.
                      </Typography>
                    </Alert>
                  </Box>
                )}

                {/* Step 2: Dietary Preferences */}
                {activeStep === 1 && (
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                      Dietary Preferences
                    </Typography>
                    
                    <FormControl component="fieldset" sx={{ mb: 4 }}>
                      <FormLabel component="legend" sx={{ fontWeight: 600, mb: 2 }}>
                        What&apos;s your dietary preference?
                      </FormLabel>
                      <RadioGroup
                        value={dietaryPreference}
                        onChange={(e) => handleDietaryChange(e.target.value as DietaryPreference)}
                      >
                        <FormControlLabel
                          value="vegetarian"
                          control={<Radio />}
                          label={
                            <Box>
                              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                Vegetarian
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                No meat, includes dairy and eggs
                              </Typography>
                            </Box>
                          }
                          sx={{ mb: 2 }}
                        />
                        <FormControlLabel
                          value="vegan"
                          control={<Radio />}
                          label={
                            <Box>
                              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                Vegan
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                No animal products
                              </Typography>
                            </Box>
                          }
                          sx={{ mb: 2 }}
                        />
                        <FormControlLabel
                          value="non-vegetarian"
                          control={<Radio />}
                          label={
                            <Box>
                              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                Non-Vegetarian
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Includes meat and all food groups
                              </Typography>
                            </Box>
                          }
                        />
                      </RadioGroup>
                    </FormControl>

                    <Divider sx={{ my: 3 }} />

                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      Fitness Goals (Select all that apply)
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 4 }}>
                      {availableGoals.map((goal) => (
                        <Chip
                          key={goal}
                          label={goal}
                          onClick={() => handleGoalChange(goal)}
                          sx={{
                            background: fitnessGoals.includes(goal) 
                              ? "linear-gradient(135deg, #FFD166, #06D6A0)"
                              : "rgba(0, 0, 0, 0.08)",
                            color: fitnessGoals.includes(goal) ? "white" : "text.primary",
                            fontWeight: fitnessGoals.includes(goal) ? 600 : 400,
                            cursor: "pointer",
                            "&:hover": {
                              background: fitnessGoals.includes(goal)
                                ? "linear-gradient(135deg, #FFC107, #00C853)"
                                : "rgba(0, 0, 0, 0.12)",
                            }
                          }}
                        />
                      ))}
                    </Box>

                    <Button
                      variant="contained"
                      onClick={() => setActiveStep(2)}
                      disabled={fitnessGoals.length === 0}
                      sx={{
                        background: "linear-gradient(135deg, #FFD166, #06D6A0)",
                        "&:hover": {
                          background: "linear-gradient(135deg, #FFC107, #00C853)",
                        },
                        "&:disabled": {
                          background: "rgba(0, 0, 0, 0.12)",
                          color: "rgba(0, 0, 0, 0.38)",
                        },
                        px: 4,
                        py: 1.5,
                        borderRadius: 3,
                        fontSize: "1.1rem",
                        fontWeight: 600,
                        textTransform: "none"
                      }}
                    >
                      Continue
                    </Button>
                  </Box>
                )}

                {/* Step 3: Review Plan */}
                {activeStep === 2 && (
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                      Review Your Plan
                    </Typography>
                    
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                      <Grid item xs={12} md={6}>
                        <Card sx={{ borderRadius: 3, height: "100%" }}>
                          <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                              <Restaurant sx={{ color: "#FFD166" }} />
                              Dietary Preference
                            </Typography>
                            <Chip
                              label={dietaryPreference.charAt(0).toUpperCase() + dietaryPreference.slice(1)}
                              sx={{
                                background: "linear-gradient(135deg, #FFD166, #06D6A0)",
                                color: "white",
                                fontWeight: 600
                              }}
                            />
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Card sx={{ borderRadius: 3, height: "100%" }}>
                          <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                              <DirectionsRun sx={{ color: "#06D6A0" }} />
                              Selected Goals
                            </Typography>
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                              {fitnessGoals.map((goal) => (
                                <Chip
                                  key={goal}
                                  label={goal}
                                  size="small"
                                  sx={{
                                    background: "rgba(6, 214, 160, 0.1)",
                                    color: "#06D6A0",
                                    fontWeight: 500
                                  }}
                                />
                              ))}
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>

                    <Alert severity="info" sx={{ borderRadius: 2, mb: 3 }}>
                      <Typography variant="body2">
                        Your 90-day plan will include personalized meal plans, workout routines, 
                        and progress tracking based on your preferences and goals.
                      </Typography>
                    </Alert>

                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Button
                        variant="outlined"
                        onClick={() => setActiveStep(1)}
                        sx={{
                          borderColor: "#FFD166",
                          color: "#FFD166",
                          "&:hover": {
                            borderColor: "#FFC107",
                            background: "rgba(255, 209, 102, 0.05)",
                          },
                        }}
                      >
                        Back
                      </Button>
                      <Button
                        variant="contained"
                        onClick={generatePlan}
                        disabled={isGenerating}
                        sx={{
                          background: "linear-gradient(135deg, #FFD166, #06D6A0)",
                          "&:hover": {
                            background: "linear-gradient(135deg, #FFC107, #00C853)",
                          },
                          px: 4,
                          py: 1.5,
                          borderRadius: 3,
                          fontSize: "1.1rem",
                          fontWeight: 600,
                          textTransform: "none"
                        }}
                      >
                        {isGenerating ? (
                          <>
                            <CircularProgress size={20} sx={{ color: "white", mr: 1 }} />
                            Generating Plan...
                          </>
                        ) : (
                          "Generate My Plan"
                        )}
                      </Button>
                    </Box>
                  </Box>
                )}

                {/* Step 4: Plan Display */}
                {activeStep === 3 && plan && (
                  <Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                      <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        Your 90-Day Plan
                      </Typography>
                      <Button
                        variant="outlined"
                        startIcon={<Save />}
                        onClick={savePlan}
                        sx={{
                          borderColor: "#FFD166",
                          color: "#FFD166",
                          "&:hover": {
                            borderColor: "#FFC107",
                            background: "rgba(255, 209, 102, 0.05)",
                          },
                        }}
                      >
                        Save Plan
                      </Button>
                    </Box>

                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Card sx={{ borderRadius: 3, height: "100%" }}>
                          <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                              <Restaurant sx={{ color: "#FFD166" }} />
                              Sample Meals
                            </Typography>
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#FFD166" }}>
                                Breakfast
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {plan.meals.breakfast[0]}
                              </Typography>
                            </Box>
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#06D6A0" }}>
                                Lunch
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {plan.meals.lunch[0]}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#7B61FF" }}>
                                Dinner
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {plan.meals.dinner[0]}
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Card sx={{ borderRadius: 3, height: "100%" }}>
                          <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                              <DirectionsRun sx={{ color: "#06D6A0" }} />
                              Sample Workouts
                            </Typography>
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#FFD166" }}>
                                Cardio
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {plan.workouts.cardio[0]}
                              </Typography>
                            </Box>
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#06D6A0" }}>
                                Strength
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {plan.workouts.strength[0]}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#7B61FF" }}>
                                Flexibility
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {plan.workouts.flexibility[0]}
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>

                    <Box sx={{ mt: 4, textAlign: "center" }}>
                      <Button
                        variant="contained"
                        component={Link}
                        href="/health-tools/saved-routines"
                        sx={{
                          background: "linear-gradient(135deg, #FFD166, #06D6A0)",
                          "&:hover": {
                            background: "linear-gradient(135deg, #FFC107, #00C853)",
                          },
                          px: 6,
                          py: 2,
                          borderRadius: 3,
                          fontSize: "1.2rem",
                          fontWeight: 600,
                          textTransform: "none"
                        }}
                      >
                        Start My Journey
                      </Button>
                    </Box>
                  </Box>
                )}
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
} 