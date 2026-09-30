import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'online',
    endpoint: '/api/contact',
    method: 'POST',
    description: 'Rithik Agrawal Terminal Portfolio — Contact Transmission Gateway',
    usage: {
      headers: { 'Content-Type': 'application/json' },
      body: {
        name: 'Recruiter or Visitor Name',
        email: 'visitor@company.com',
        message: 'Message content'
      }
    }
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required.' },
        { status: 400 }
      );
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address.' },
        { status: 400 }
      );
    }

    // Server-side logging of transmission
    console.log(`[CONTACT TRANSMISSION] From: ${name} <${email}>`);
    console.log(`[MESSAGE CONTENT]: ${message}`);

    // Return success receipt with transmission hash
    const receiptId = 'TRX-' + Math.random().toString(36).substring(2, 10).toUpperCase();

    return NextResponse.json({
      success: true,
      receiptId,
      timestamp: new Date().toISOString(),
      message: `Transmission received and logged successfully. Rithik will respond within 24 hours.`,
    });
  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error while processing transmission.' },
      { status: 500 }
    );
  }
}
