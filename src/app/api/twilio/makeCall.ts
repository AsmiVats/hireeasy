import type { NextApiRequest, NextApiResponse } from 'next';
import twilioClient from '@/lib/twilioClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("Request method:", req.method); // Log request method
  console.log("Request body:", req.body); // Log request body
  
  if (req.method === 'POST') {
    const { to, from, message } = req.body;

    if (!to || !from || !message) {
      return res.status(400).json({ error: 'Missing required parameters: to, from, message' });
    }

    try {
      const call = await twilioClient.calls.create({
        to,
        from,
        twiml: `<Response><Say>${message}</Say></Response>`,
      });

      console.log("Twilio response:", call); // Log Twilio API response
      res.status(200).json({ success: true, data: call });
    } catch (error: any) {
      console.error('Error making call:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
