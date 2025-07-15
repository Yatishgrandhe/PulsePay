// API Configuration for Health Tools
// Replace these placeholder values with actual API keys and endpoints

export const API_CONFIG = {
  // OpenRouter API for Therapist Chat
  OPENROUTER: {
    API_KEY: process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || 'your_openrouter_api_key_here',
    BASE_URL: 'https://openrouter.ai/api/v1',
    MODEL: 'anthropic/claude-3.5-sonnet', // Recommended for mental health conversations
    MAX_TOKENS: 1000,
    TEMPERATURE: 0.7
  },

  // Computer Vision API for Posture Check
  COMPUTER_VISION: {
    API_KEY: process.env.NEXT_PUBLIC_COMPUTER_VISION_API_KEY || 'your_computer_vision_api_key_here',
    BASE_URL: 'https://api.openai.com/v1/chat/completions', // Using OpenAI Vision API as example
    MODEL: 'gpt-4-vision-preview',
    MAX_TOKENS: 500
  },

  // Nutrition Database API for Fitness Planner
  NUTRITION: {
    API_KEY: process.env.NEXT_PUBLIC_NUTRITION_API_KEY || 'your_nutrition_api_key_here',
    BASE_URL: 'https://api.edamam.com/api/nutrition-data', // Example: Edamam API
    APP_ID: process.env.NEXT_PUBLIC_NUTRITION_APP_ID || 'your_app_id_here',
    APP_KEY: process.env.NEXT_PUBLIC_NUTRITION_APP_KEY || 'your_app_key_here'
  },

  // Supabase Configuration (already exists)
  SUPABASE: {
    URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'your_supabase_url_here',
    ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your_supabase_anon_key_here'
  }
};

// API Helper Functions
export const apiHelpers = {
  // Therapist Chat API
  async sendChatMessage(message: string, conversationHistory: any[] = []) {
    try {
      // Placeholder implementation - replace with actual OpenRouter API call
      console.log('Sending message to OpenRouter API:', message);
      
      // Simulate API response
      return {
        success: true,
        response: "This is a placeholder response. Please configure the OpenRouter API for actual functionality.",
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error sending chat message:', error);
      return {
        success: false,
        error: 'Failed to send message. Please try again.'
      };
    }
  },

  // Posture Analysis API
  async analyzePosture(imageData: string) {
    try {
      // Placeholder implementation - replace with actual Computer Vision API call
      console.log('Analyzing posture with Computer Vision API');
      
      // Simulate API response
      return {
        success: true,
        analysis: {
          score: Math.floor(Math.random() * 40) + 60, // 60-100
          status: ['good', 'fair', 'poor'][Math.floor(Math.random() * 3)],
          feedback: [
            "Your posture looks good overall",
            "Consider adjusting your head position",
            "Shoulders could be more relaxed"
          ],
          recommendations: [
            "Maintain current posture",
            "Take regular breaks",
            "Practice ergonomic exercises"
          ]
        }
      };
    } catch (error) {
      console.error('Error analyzing posture:', error);
      return {
        success: false,
        error: 'Failed to analyze posture. Please try again.'
      };
    }
  },

  // Fitness Plan Generation API
  async generateFitnessPlan(userData: {
    image?: string;
    dietaryPreference: string;
    goals: string[];
    fitnessLevel: string;
  }) {
    try {
      // Placeholder implementation - replace with actual API calls
      console.log('Generating fitness plan with user data:', userData);
      
      // Simulate API response
      return {
        success: true,
        plan: {
          id: Date.now().toString(),
          name: "90-Day Wellness Journey",
          duration: 90,
          difficulty: "Intermediate",
          goals: userData.goals,
          meals: {
            breakfast: [
              "Oatmeal with berries and nuts",
              "Greek yogurt with honey",
              "Whole grain toast with avocado"
            ],
            lunch: [
              "Quinoa salad with vegetables",
              "Grilled chicken with brown rice",
              "Lentil soup with whole grain bread"
            ],
            dinner: [
              "Salmon with steamed vegetables",
              "Vegetarian pasta with tomato sauce",
              "Chickpea curry with rice"
            ]
          },
          workouts: {
            cardio: [
              "30 minutes brisk walking",
              "20 minutes HIIT training",
              "45 minutes cycling"
            ],
            strength: [
              "Push-ups and squats (3 sets each)",
              "Dumbbell exercises for arms",
              "Core strengthening exercises"
            ],
            flexibility: [
              "10 minutes stretching routine",
              "Yoga flow sequence",
              "Pilates exercises"
            ]
          }
        }
      };
    } catch (error) {
      console.error('Error generating fitness plan:', error);
      return {
        success: false,
        error: 'Failed to generate fitness plan. Please try again.'
      };
    }
  },

  // Nutrition Analysis API
  async analyzeNutrition(mealDescription: string) {
    try {
      // Placeholder implementation - replace with actual Nutrition API call
      console.log('Analyzing nutrition for:', mealDescription);
      
      // Simulate API response
      return {
        success: true,
        nutrition: {
          calories: Math.floor(Math.random() * 500) + 200,
          protein: Math.floor(Math.random() * 30) + 10,
          carbs: Math.floor(Math.random() * 50) + 20,
          fat: Math.floor(Math.random() * 20) + 5,
          fiber: Math.floor(Math.random() * 10) + 2
        }
      };
    } catch (error) {
      console.error('Error analyzing nutrition:', error);
      return {
        success: false,
        error: 'Failed to analyze nutrition. Please try again.'
      };
    }
  }
};

// Environment Variables Template
export const ENV_TEMPLATE = `
# Health Tools API Configuration
# Copy these to your .env.local file and replace with actual values

# OpenRouter API (for Therapist Chat)
NEXT_PUBLIC_OPENROUTER_API_KEY=your_openrouter_api_key_here

# Computer Vision API (for Posture Check)
NEXT_PUBLIC_COMPUTER_VISION_API_KEY=your_computer_vision_api_key_here

# Nutrition Database API (for Fitness Planner)
NEXT_PUBLIC_NUTRITION_API_KEY=your_nutrition_api_key_here
NEXT_PUBLIC_NUTRITION_APP_ID=your_app_id_here
NEXT_PUBLIC_NUTRITION_APP_KEY=your_app_key_here

# Supabase Configuration (if not already configured)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
`;

export default API_CONFIG; 