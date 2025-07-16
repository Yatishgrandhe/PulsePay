import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface ChatRequest {
  message: string;
  sessionId: string;
  userId?: string;
  localMessages?: ChatMessage[];
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { message, sessionId, localMessages } = body;

    // Get user from auth header if available
    let user = null;
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(token);
      if (!authError && authUser) {
        user = authUser;
      }
    }

    // If user is logged in and has local messages, transfer them to database
    if (user && localMessages && localMessages.length > 0) {
      await transferLocalMessagesToDatabase(user.id, sessionId, localMessages);
    }

    // Get chat history from database if user is logged in
    let chatHistory: ChatMessage[] = [];
    if (user) {
      const { data: dbMessages } = await supabase
        .from('chat_sessions')
        .select('messages')
        .eq('user_id', user.id)
        .eq('session_id', sessionId)
        .single();

      if (dbMessages?.messages) {
        chatHistory = dbMessages.messages;
      }
    }

    // Prepare conversation for AI
    const conversation = [
      {
        role: 'system' as const,
        content: `You are Dr. Sarah Chen, a licensed clinical psychologist with 15+ years of experience specializing in cognitive behavioral therapy and mindfulness-based interventions. You provide warm, empathetic, and evidence-based support.

Key Guidelines:
- Keep responses concise and clear (2-3 sentences max)
- Be encouraging and positive, especially when the user expresses negative emotions
- Use a warm, professional tone
- Offer practical, actionable advice when appropriate
- Maintain appropriate therapeutic boundaries
- If someone is in crisis, encourage them to contact emergency services

Remember: You're here to support and guide, not replace professional mental health care.`
      },
      ...chatHistory.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      })),
      {
        role: 'user' as const,
        content: message
      }
    ];

    // Call OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://health-ai.com',
        'X-Title': 'Health AI Therapist Chat'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        messages: conversation,
        max_tokens: 150,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error('Failed to get AI response');
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content || 'I apologize, but I\'m having trouble responding right now. Please try again in a moment.';

    // Create response message
    const responseMessage: ChatMessage = {
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date().toISOString()
    };

    // Store in database if user is logged in
    if (user) {
      const updatedMessages = [...chatHistory, 
        { role: 'user', content: message, timestamp: new Date().toISOString() },
        responseMessage
      ];

      await supabase
        .from('chat_sessions')
        .upsert({
          user_id: user.id,
          session_id: sessionId,
          messages: updatedMessages,
          last_updated: new Date().toISOString()
        });
    }

    return NextResponse.json({
      response: aiResponse,
      sessionId,
      userId: user?.id || null
    });

  } catch (error) {
    console.error('Therapist chat error:', error);
    return NextResponse.json({ 
      error: 'Failed to process message',
      response: 'I apologize, but I\'m having trouble responding right now. Please try again in a moment.'
    }, { status: 500 });
  }
}

async function transferLocalMessagesToDatabase(userId: string, sessionId: string, localMessages: ChatMessage[]) {
  try {
    // Check if session already exists
    const { data: existingSession } = await supabase
      .from('chat_sessions')
      .select('messages')
      .eq('user_id', userId)
      .eq('session_id', sessionId)
      .single();

    if (existingSession) {
      // Merge local messages with existing ones, avoiding duplicates
      const existingMessages = existingSession.messages || [];
      const mergedMessages = [...existingMessages];
      
      localMessages.forEach(localMsg => {
        const exists = existingMessages.some((existing: ChatMessage) => 
          existing.content === localMsg.content && 
          existing.timestamp === localMsg.timestamp
        );
        if (!exists) {
          mergedMessages.push(localMsg);
        }
      });

      await supabase
        .from('chat_sessions')
        .update({
          messages: mergedMessages,
          last_updated: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('session_id', sessionId);
    } else {
      // Create new session with local messages
      await supabase
        .from('chat_sessions')
        .insert({
          user_id: userId,
          session_id: sessionId,
          messages: localMessages,
          last_updated: new Date().toISOString()
        });
    }
  } catch (error) {
    console.error('Error transferring local messages:', error);
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !sessionId) {
      return NextResponse.json({ error: 'Missing authentication or session ID' }, { status: 400 });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Get chat history
    const { data: chatSession } = await supabase
      .from('chat_sessions')
      .select('messages, created_at, last_updated')
      .eq('user_id', user.id)
      .eq('session_id', sessionId)
      .single();

    return NextResponse.json({
      messages: chatSession?.messages || [],
      createdAt: chatSession?.created_at,
      lastUpdated: chatSession?.last_updated
    });

  } catch (error) {
    console.error('Get chat history error:', error);
    return NextResponse.json({ error: 'Failed to get chat history' }, { status: 500 });
  }
} 