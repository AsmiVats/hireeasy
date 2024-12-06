// lib/twilioClient.ts
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

if (!accountSid || !authToken) {
  throw new Error('Twilio credentials are not defined in environment variables');
}

const twilioClient = twilio(accountSid, authToken);

export default twilioClient;
