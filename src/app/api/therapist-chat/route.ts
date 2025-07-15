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

    // Friendly conversation prompt
    const enhancedPrompt = `You are a caring, supportive friend who's here to listen and chat. You're warm, friendly, and genuinely want to help people feel better.

The user has shared: "${message}"

Please respond like a good friend would:

1. **Be Supportive**: 
   - If they're feeling down: Be positive, hopeful, and encouraging
   - If they're anxious: Be calm and reassuring
   - If they're angry: Be understanding and help them feel heard
   - If they're happy: Celebrate with them!

2. **Listen & Validate**: Show you understand how they're feeling and that it's okay to feel that way.

3. **Offer Gentle Help**: Give one simple, friendly suggestion that might help them feel better.

4. **Keep It Casual**: Use everyday language - no fancy talk, just being a good friend.

Keep your response short and sweet (1-2 sentences max). Be encouraging and positive, especially when they're having a tough time. Help them see the good things and possibilities.`;

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
            content: 'You are a caring, supportive friend who\'s here to listen and chat. You\'re warm, friendly, and genuinely want to help people feel better. Keep responses short and sweet (1-2 sentences max). Use casual, everyday language - no fancy talk, just being a good friend. Be encouraging and positive, especially when they\'re having a tough time. Help them see the good things and possibilities.'
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
        max_tokens: 600,
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
        response: `Hey, I totally get how you're feeling right now. It's totally okay to feel this way, and I'm here to listen and chat with you.

You know what? Sometimes just talking to someone who cares can make a huge difference. Maybe try reaching out to a friend or family member who you trust, or do something that makes you smile - like watching a funny video or going for a walk.

Remember, tough times don't last forever, and you're stronger than you think! What's been on your mind lately? I'm here to chat whenever you need a friend.`
      });
    }

    return NextResponse.json({
      response: aiResponse
    });

  } catch (error) {
    console.error('Therapist chat API error:', error);
    
    // Fallback response for any errors
    return NextResponse.json({
      response: `Oops! I'm having a little trouble connecting right now, but don't worry - I'm still here for you!

You know what always helps me feel better? Talking to someone who cares, doing something fun, or just taking a few deep breaths. Maybe try calling a friend or doing something that makes you smile?

I'll be back to chat soon! Remember, you're awesome and you've got this. Brighter days are definitely ahead! 🌟`
    });
  }
} 