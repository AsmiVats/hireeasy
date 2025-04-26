import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

export async function POST(req: Request) {
  try {
    const customer = await stripe.customers.create({
      metadata: {
        userId: 'user_123',
      },
    });

    const session = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/account`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Error:', err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
} 