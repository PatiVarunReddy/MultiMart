const nodemailer = require('nodemailer');

// Read SMTP config from env
let SMTP_HOST = (process.env.SMTP_HOST || 'smtp.gmail.com').trim();
let SMTP_PORT = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
let SMTP_USER = process.env.SMTP_USER ? process.env.SMTP_USER.trim() : '';
// Remove any whitespace in the provided SMTP password (many users paste app passwords with spaces)
let SMTP_PASS = process.env.SMTP_PASS ? process.env.SMTP_PASS.replace(/\s+/g, '') : '';
let SMTP_FROM = process.env.SMTP_FROM ? process.env.SMTP_FROM.trim() : SMTP_USER;
// Remove surrounding quotes if present (dotenv will include quotes as part of the value)
if ((SMTP_FROM.startsWith("'") && SMTP_FROM.endsWith("'")) || (SMTP_FROM.startsWith('"') && SMTP_FROM.endsWith('"'))) {
  SMTP_FROM = SMTP_FROM.slice(1, -1);
}
if ((SMTP_USER.startsWith("'") && SMTP_USER.endsWith("'")) || (SMTP_USER.startsWith('"') && SMTP_USER.endsWith('"'))) {
  SMTP_USER = SMTP_USER.slice(1, -1);
}
let SMTP_SECURE = (process.env.SMTP_SECURE === 'true') || (SMTP_PORT === 465);

// create a transporter variable that may be re-assigned to an ethereal test account in dev
let transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_SECURE,
  auth: SMTP_USER && SMTP_PASS ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
  tls: {
    // allow self-signed certs (helpful in some dev environments)
    rejectUnauthorized: false
  }
});

// Try to verify configured transporter. If verification fails and we're in development,
// fall back to a nodemailer test account (Ethereal) so sends succeed and a preview URL is available.
// Initialize transporter and expose a promise so callers can wait for initialization
let transporterReady = (async function initTransporter() {
  try {
    await transporter.verify();
    if (SMTP_USER && SMTP_PASS) console.log('✅ SMTP transporter is ready');
    else console.log('⚠️ SMTP transporter created but credentials are missing; email sending will be skipped (will fallback to ethereal in dev)');
  } catch (err) {
    console.warn('⚠️ SMTP transporter verification failed:', err && err.message ? err.message : err);

    const isProd = process.env.NODE_ENV === 'production';
    const allowDevFallback = process.env.DEV_OTP === 'true' || !isProd;

    if (allowDevFallback) {
      try {
        console.log('Attempting to create a Nodemailer test account for dev (ethereal) fallback...');
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
          host: testAccount.smtp.host,
          port: testAccount.smtp.port,
          secure: testAccount.smtp.secure,
          auth: { user: testAccount.user, pass: testAccount.pass }
        });
        SMTP_FROM = SMTP_FROM || `"Dev Mailer" <${testAccount.user}>`;
        console.log('✅ Using ethereal test account for email sending (development). Messages will have a preview URL.');
      } catch (createErr) {
        console.warn('Failed to create ethereal test account:', createErr && createErr.message ? createErr.message : createErr);
      }
    }
  }
})();

/**
 * Send an email.
 * Returns the nodemailer "info" object on success, or false on failure.
 * In development, if no real SMTP is configured, this may use an ethereal test account
 * and a preview URL will be printed to the console.
 */
async function sendMail({ to, subject, html, text }) {
  // Wait for initialization (verify / ethereal fallback) to complete so we don't race the setup
  if (transporterReady) await transporterReady;

  // If SMTP credentials are missing AND we're in production, skip sending.
  if ((!SMTP_USER || !SMTP_PASS) && process.env.NODE_ENV === 'production') {
    console.warn('SMTP not configured in production - skipping email send');
    return false;
  }

  try {
    const info = await transporter.sendMail({
      from: SMTP_FROM,
      to,
      subject,
      text,
      html
    });

    console.log(`✉️ Email sent to ${to}: ${info.messageId || '[no id]'}`);

    // If this was sent via ethereal, print the preview URL to help devs inspect the message
    try {
      const preview = nodemailer.getTestMessageUrl(info);
      if (preview) console.log('🔍 Preview URL:', preview);
    } catch (e) {
      // ignore
    }

    return info;
  } catch (err) {
    console.error('❌ Error sending email to', to, err && err.message ? err.message : err);
    return false;
  }
}

module.exports = { sendMail };
