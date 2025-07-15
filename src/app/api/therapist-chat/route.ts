import { NextRequest, NextResponse } from 'next/server';

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory } = await request.json();

    // Enhanced prompt with explicit internet research request
    const enhancedPrompt = `You are a professional therapist and mental health counselor with access to current psychological research and therapeutic techniques. 

IMPORTANT: Please research the internet for the most up-to-date, evidence-based information related to the user's situation. Include recent studies, current therapeutic approaches, and contemporary mental health resources.

The user has shared: "${message}"

Please provide a comprehensive, empathetic, and research-based response that includes:

1. **Current Research Insights**: Reference the most recent psychological research, evidence-based therapeutic approaches (CBT, DBT, ACT, EMDR, etc.), and relevant studies from the past 2-3 years that could help with their situation.

2. **Practical Coping Strategies**: Offer specific, actionable steps they can implement immediately, such as:
   - Modern breathing techniques (4-7-8, box breathing, etc.)
   - Grounding exercises (5-4-3-2-1, body scan, etc.)
   - Cognitive reframing exercises
   - Current self-care practices
   - Digital wellness strategies
   - Journaling prompts and apps

3. **Emotional Validation**: Acknowledge their feelings and experiences with empathy while maintaining professional boundaries.

4. **Safety Assessment**: If they mention any crisis indicators (self-harm, suicidal thoughts, etc.), provide current crisis resources and encourage professional help.

5. **Professional Boundaries**: Remind them that you're an AI assistant and not a replacement for professional therapy, especially for complex mental health issues.

6. **Structured Response**: Organize your response in a clear, easy-to-read format with:
   - Immediate support/validation
   - Research-based insights (with recent studies if applicable)
   - Practical strategies
   - Professional recommendations

7. **Current Resources**: Mention relevant apps, websites, or resources that are currently available and helpful.

Keep your response conversational, professional, and focused on their specific situation. Use a warm, supportive tone while maintaining therapeutic boundaries. Ensure all information is current and evidence-based.`;

    // Prepare conversation context (last 5 messages for continuity)
    const recentMessages = conversationHistory.slice(-5);
    
    // Use OpenRouter API for enhanced responses with internet research
    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': request.headers.get('origin') || 'https://pulsepay.vercel.app',
        'X-Title': 'PulsePay AI Therapist'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        messages: [
          {
            role: 'system',
            content: 'You are a professional mental health counselor with expertise in evidence-based therapeutic techniques, current psychological research, and crisis intervention. You have access to the internet and should research the most up-to-date information to provide accurate, current, and helpful responses. You provide empathetic, research-based support while maintaining professional boundaries and encouraging professional help when appropriate. Always cite recent research when possible and provide current, actionable advice.'
          },
          ...recentMessages.map((msg: Message) => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text
          })),
          {
            role: 'user',
            content: enhancedPrompt
          }
        ],
        max_tokens: 1200,
        temperature: 0.7,
        stream: false
      })
    });

    if (!openRouterResponse.ok) {
      throw new Error(`OpenRouter API error: ${openRouterResponse.status}`);
    }

    const data = await openRouterResponse.json();
    const aiResponse = data.choices[0]?.message?.content || '';

    // Fallback response if API fails
    if (!aiResponse) {
      return NextResponse.json({
        response: `I understand how you're feeling, and I want to help. While I'm here to provide support and research-based insights, it's important to remember that I'm an AI assistant and not a replacement for professional therapy.

For your situation, I'd recommend:
• Talking to a licensed therapist or counselor
• Reaching out to trusted friends or family
• Practicing self-care activities that work for you
• Consider crisis resources if you're in immediate distress

Would you like to share more about what's been on your mind? I'm here to listen and provide supportive guidance.`
      });
    }

    return NextResponse.json({
      response: aiResponse
    });

  } catch (error) {
    console.error('Therapist chat API error:', error);
    
    // Fallback response for any errors
    return NextResponse.json({
      response: `I apologize, but I'm having trouble connecting to my research database right now. 

Here are some immediate resources that might help:
• **Crisis Support**: If you're in crisis, please call 988 (Suicide & Crisis Lifeline) or text HOME to 741741 (Crisis Text Line)
• **Professional Help**: Consider reaching out to a licensed therapist or counselor
• **Self-Care**: Practice deep breathing, grounding exercises, or activities that bring you comfort

I'm here to continue our conversation when the connection is restored. Your feelings are valid, and it's okay to reach out for professional support.`
    });
  }
} 