# Health Tools API Setup Guide

This guide provides instructions for setting up the APIs required for PulsePay's health and wellness tools.

## 🔧 Required APIs

### 1. OpenRouter API (Therapist Chat)
**Purpose**: AI-powered mental health support conversations

**Setup Steps**:
1. Visit [OpenRouter.ai](https://openrouter.ai/)
2. Create an account and get your API key
3. Add to environment variables:
   ```env
   NEXT_PUBLIC_OPENROUTER_API_KEY=your_api_key_here
   ```

**Recommended Model**: `anthropic/claude-3.5-sonnet` (optimized for mental health conversations)

### 2. Computer Vision API (Posture Check)
**Purpose**: Real-time posture analysis using camera feed

**Options**:
- **OpenAI Vision API** (Recommended)
- **Google Cloud Vision API**
- **Azure Computer Vision**

**Setup Steps**:
1. Choose your preferred provider
2. Get API credentials
3. Add to environment variables:
   ```env
   NEXT_PUBLIC_COMPUTER_VISION_API_KEY=your_api_key_here
   ```

### 3. Nutrition Database API (Fitness Planner)
**Purpose**: Meal planning and nutritional analysis

**Recommended**: Edamam Nutrition API
**Alternative**: Spoonacular API

**Setup Steps**:
1. Visit [Edamam Developer Portal](https://developer.edamam.com/)
2. Create an account and get App ID & Key
3. Add to environment variables:
   ```env
   NEXT_PUBLIC_NUTRITION_API_KEY=your_api_key_here
   NEXT_PUBLIC_NUTRITION_APP_ID=your_app_id_here
   NEXT_PUBLIC_NUTRITION_APP_KEY=your_app_key_here
   ```

## 📁 Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Health Tools API Configuration

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
```

## 🚀 Implementation Steps

### Step 1: Replace Placeholder Functions
The current implementation uses placeholder functions in `src/utils/apiConfig.ts`. Replace these with actual API calls:

1. **Therapist Chat**: Update `sendChatMessage()` function
2. **Posture Check**: Update `analyzePosture()` function  
3. **Fitness Planner**: Update `generateFitnessPlan()` function
4. **Nutrition**: Update `analyzeNutrition()` function

### Step 2: Error Handling
Implement proper error handling for:
- API rate limits
- Network failures
- Invalid responses
- User feedback

### Step 3: Security Considerations
- Store API keys securely
- Implement request validation
- Add rate limiting
- Monitor API usage

## 🔒 Security & Privacy

### Data Protection
- **No Image Storage**: Camera feeds are processed in real-time, not stored
- **Encrypted Communication**: All API calls use HTTPS
- **User Consent**: Clear privacy policies and user consent

### Compliance
- **HIPAA Considerations**: For US healthcare applications
- **GDPR Compliance**: For EU users
- **Medical Disclaimers**: Required legal notices

## 📊 API Usage Monitoring

Monitor your API usage to:
- Track costs
- Ensure rate limits aren't exceeded
- Optimize performance
- Plan for scaling

## 🛠️ Development vs Production

### Development
- Use placeholder functions for testing
- Mock API responses
- Test UI/UX without API costs

### Production
- Implement real API calls
- Add proper error handling
- Monitor performance and costs
- Implement caching where appropriate

## 📞 Support

For API-specific issues:
- **OpenRouter**: [OpenRouter Support](https://openrouter.ai/docs)
- **OpenAI**: [OpenAI Documentation](https://platform.openai.com/docs)
- **Edamam**: [Edamam Documentation](https://developer.edamam.com/edamam-nutrition-api)

## 🔄 Updates

This guide will be updated as new APIs are added or existing ones are modified. Check back regularly for the latest setup instructions.

---

**Note**: The current implementation uses placeholder functions that simulate API responses. Replace these with actual API calls before deploying to production. 