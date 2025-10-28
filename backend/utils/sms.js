// Simple SMS helper that uses Twilio when configured, otherwise logs OTP to console
import twilio from 'twilio';

function getTwilioClient() {
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_FROM) return null;
  return twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

async function sendSms({ to, body }) {
  const client = getTwilioClient();
  if (!client) {
    console.warn(`SMS to ${to}: ${body} (Twilio not configured)`);
    return false;
  }

  const msg = await client.messages.create({ body, to, from: process.env.TWILIO_FROM });
  return msg;
}

export { sendSms };
