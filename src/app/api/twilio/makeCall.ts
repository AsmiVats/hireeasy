import type { NextApiRequest, NextApiResponse } from "next";
import twilioClient from "@/lib/twilioClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("Received request at /api/twilio/makeCall"); // Debug log

  if (req.method === "POST") {
    const { to, message } = req.body;
    const from = process.env.TWILIO_PHONE_NUMBER; // Ensure TWILIO_PHONE_NUMBER is set in env vars

    if (!to || !message || !from) {
      console.error("Missing required parameters:", { to, from, message });
      return res
        .status(400)
        .json({ error: "Missing required parameters: to, from, message" });
    }

    try {
      const call = await twilioClient.calls.create({
        to,
        from,
        twiml: `<Response><Say>${message}</Say></Response>`,
      });

      console.log("Call successfully made:", call); // Debug log
      res.status(200).json({ success: true, data: call });
    } catch (error: any) {
      console.error("Error making call:", error.message); // Debug log
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    console.error(`Method ${req.method} Not Allowed`);
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
