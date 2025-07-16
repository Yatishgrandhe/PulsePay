import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';

interface PaymentRequest {
  amount: number;
  recipientName: string;
  recipientEmail: string;
  recipientPhone: string;
  description: string;
  emergencyType?: 'medical' | 'dental' | 'pharmacy' | 'ambulance' | 'other';
  paymentType: 'emergency' | 'regular';
}

export async function POST(request: NextRequest) {
  try {
    // Get user from auth header
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body: PaymentRequest = await request.json();
    const { amount, recipientName, recipientEmail, recipientPhone, description, emergencyType, paymentType } = body;

    // Validate input
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    if (!recipientName || !recipientEmail) {
      return NextResponse.json({ error: 'Recipient information required' }, { status: 400 });
    }

    // Get user's wallet
    const { data: wallet, error: walletError } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single();

    if (walletError || !wallet) {
      return NextResponse.json({ error: 'No active wallet found' }, { status: 400 });
    }

    // Check wallet balance (simplified - in real app, check actual blockchain balance)
    if (wallet.balance < amount) {
      return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
    }

    // Generate transaction hash (in real app, this would be from blockchain)
    const txHash = `0x${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;

    // Create payment record
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert([
        {
          user_id: user.id,
          wallet_id: wallet.id,
          payment_type: paymentType,
          amount: amount.toString(),
          currency: 'USD',
          recipient_name: recipientName,
          recipient_email: recipientEmail,
          recipient_phone: recipientPhone,
          description,
          emergency_type: emergencyType,
          status: 'completed',
          tx_hash: txHash,
          blockchain_network: 'ethereum',
          ai_verification_status: 'approved'
        }
      ])
      .select()
      .single();

    if (paymentError) {
      console.error('Payment creation error:', paymentError);
      return NextResponse.json({ error: 'Failed to create payment record' }, { status: 500 });
    }

    // Update wallet balance
    const newBalance = parseFloat(wallet.balance.toString()) - amount;
    const { error: balanceError } = await supabase
      .from('wallets')
      .update({ balance: newBalance.toString() })
      .eq('id', wallet.id);

    if (balanceError) {
      console.error('Balance update error:', balanceError);
    }

    // Create wallet transaction record
    const { error: txError } = await supabase
      .from('wallet_transactions')
      .insert([
        {
          wallet_id: wallet.id,
          transaction_hash: txHash,
          transaction_type: 'payment',
          amount: amount.toString(),
          status: 'confirmed'
        }
      ]);

    if (txError) {
      console.error('Transaction record error:', txError);
    }

    // Send confirmation email
    try {
      await sendPaymentConfirmationEmail({
        userEmail: user.email!,
        userName: user.user_metadata?.full_name || 'User',
        recipientName,
        recipientEmail,
        amount,
        description,
        txHash,
        paymentType
      });
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Don't fail the payment if email fails
    }

    // Log audit trail
    const { error: auditError } = await supabase
      .from('audit_logs')
      .insert([
        {
          user_id: user.id,
          action: 'payment_created',
          resource_type: 'payment',
          resource_id: payment.id,
          new_values: { amount, recipientName, txHash }
        }
      ]);

    if (auditError) {
      console.error('Audit log error:', auditError);
    }

    return NextResponse.json({
      success: true,
      payment: {
        id: payment.id,
        amount,
        txHash,
        status: 'completed',
        recipientName,
        recipientEmail
      }
    });

  } catch (error) {
    console.error('Payment processing error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function sendPaymentConfirmationEmail({
  userEmail,
  userName,
  recipientName,
  recipientEmail,
  amount,
  description,
  txHash,
  paymentType
}: {
  userEmail: string;
  userName: string;
  recipientName: string;
  recipientEmail: string;
  amount: number;
  description: string;
  txHash: string;
  paymentType: string;
}) {
  // Store email notification in database
  const { error } = await supabase
    .from('email_notifications')
    .insert([
      {
        user_id: (await supabase.auth.getUser()).data.user?.id,
        email_type: 'payment_confirmation',
        recipient_email: userEmail,
        subject: `Payment Confirmation - $${amount.toFixed(2)}`,
        content: `
          Dear ${userName},
          
          Your payment of $${amount.toFixed(2)} has been successfully processed.
          
          Payment Details:
          - Recipient: ${recipientName} (${recipientEmail})
          - Amount: $${amount.toFixed(2)}
          - Description: ${description}
          - Transaction Hash: ${txHash}
          - Type: ${paymentType}
          
          Thank you for using PulsePay!
        `,
        status: 'sent',
        sent_at: new Date().toISOString()
      }
    ]);

  if (error) {
    console.error('Email notification storage error:', error);
  }

  // In a real implementation, you would integrate with a proper email service
  // like SendGrid, AWS SES, or your own SMTP server
  console.log('Payment confirmation email would be sent to:', userEmail);
} 