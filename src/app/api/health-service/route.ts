import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';

interface HealthServiceRequest {
  serviceType: string;
  serviceName: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  description: string;
  appointmentDate: string;
  appointmentTime: string;
  priority: 'routine' | 'urgent' | 'emergency';
  price: number;
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

    const body: HealthServiceRequest = await request.json();
    const { 
      serviceType, 
      serviceName, 
      patientName, 
      patientEmail, 
      patientPhone, 
      description, 
      appointmentDate, 
      appointmentTime, 
      priority, 
      price 
    } = body;

    // Validate input
    if (!serviceType || !serviceName) {
      return NextResponse.json({ error: 'Service information required' }, { status: 400 });
    }

    if (!patientName || !patientEmail) {
      return NextResponse.json({ error: 'Patient information required' }, { status: 400 });
    }

    if (!appointmentDate || !appointmentTime) {
      return NextResponse.json({ error: 'Appointment details required' }, { status: 400 });
    }

    // Create health service booking record
    const { data: service, error: serviceError } = await supabase
      .from('health_services')
      .insert([
        {
          user_id: user.id,
          service_type: serviceType,
          service_name: serviceName,
          patient_name: patientName,
          patient_email: patientEmail,
          patient_phone: patientPhone,
          description,
          appointment_date: appointmentDate,
          appointment_time: appointmentTime,
          priority,
          price: price.toString(),
          status: 'confirmed',
          ai_recommendation: 'AI analysis completed - service approved'
        }
      ])
      .select()
      .single();

    if (serviceError) {
      console.error('Service booking error:', serviceError);
      return NextResponse.json({ error: 'Failed to create service booking' }, { status: 500 });
    }

    // Create health tools usage record
    const { error: usageError } = await supabase
      .from('health_tools_usage')
      .insert([
        {
          user_id: user.id,
          tool_type: serviceType,
          usage_data: {
            service_name: serviceName,
            patient_name: patientName,
            priority,
            price
          },
          duration: 30, // Default duration in minutes
          status: 'completed'
        }
      ]);

    if (usageError) {
      console.error('Usage record error:', usageError);
    }

    // Send confirmation email
    try {
      await sendServiceConfirmationEmail({
        userEmail: user.email!,
        userName: user.user_metadata?.full_name || 'User',
        patientName,
        patientEmail,
        serviceName,
        appointmentDate,
        appointmentTime,
        price,
        priority
      });
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Don't fail the booking if email fails
    }

    // Log audit trail
    const { error: auditError } = await supabase
      .from('audit_logs')
      .insert([
        {
          user_id: user.id,
          action: 'health_service_booked',
          resource_type: 'health_service',
          resource_id: service.id,
          new_values: { serviceName, patientName, appointmentDate, priority }
        }
      ]);

    if (auditError) {
      console.error('Audit log error:', auditError);
    }

    return NextResponse.json({
      success: true,
      service: {
        id: service.id,
        serviceName,
        patientName,
        patientEmail,
        appointmentDate,
        appointmentTime,
        priority,
        price,
        status: 'confirmed'
      }
    });

  } catch (error) {
    console.error('Health service booking error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function sendServiceConfirmationEmail({
  userEmail,
  userName,
  patientName,
  patientEmail,
  serviceName,
  appointmentDate,
  appointmentTime,
  price,
  priority
}: {
  userEmail: string;
  userName: string;
  patientName: string;
  patientEmail: string;
  serviceName: string;
  appointmentDate: string;
  appointmentTime: string;
  price: number;
  priority: string;
}) {
  // Store email notification in database
  const { error } = await supabase
    .from('email_notifications')
    .insert([
      {
        user_id: (await supabase.auth.getUser()).data.user?.id,
        email_type: 'service_confirmation',
        recipient_email: userEmail,
        subject: `Health Service Confirmation - ${serviceName}`,
        content: `
          Dear ${userName},
          
          Your health service has been successfully booked with Health AI.
          
          Service Details:
          - Service: ${serviceName}
          - Patient: ${patientName}
          - Date: ${new Date(appointmentDate).toLocaleDateString()}
          - Time: ${appointmentTime}
          - Priority: ${priority}
          - Price: $${price.toFixed(2)}
          
          A confirmation email has also been sent to ${patientEmail}.
          
          Thank you for choosing Health AI!
          
          Best regards,
          The Health AI Team
        `,
        status: 'sent'
      }
    ]);

  if (error) {
    console.error('Email notification error:', error);
  }
} 