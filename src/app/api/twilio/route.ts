import { NextResponse } from 'next/server';
import twilioClient from '@/lib/twilioClient';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { to, message } = body;

    const TWILIO_PHONE_NUMBER = '+19382043039';

    if (!to || !message) {
      return NextResponse.json(
        { error: 'Missing required parameters: to, message' },
        { status: 400 }
      );
    }

    const call = await twilioClient.calls.create({
      to,
      from: TWILIO_PHONE_NUMBER,
      twiml: `<Response><Say>${message}</Say></Response>`,
    });

    return NextResponse.json({ success: true, data: call }, { status: 200 });
  } catch (error: any) {
    console.error('Error making call:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
