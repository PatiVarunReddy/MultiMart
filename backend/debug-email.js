require('dotenv').config();

// Debug SMTP configuration
console.log('SMTP Configuration Debug:');
console.log('SMTP_HOST:', process.env.SMTP_HOST);
console.log('SMTP_PORT:', process.env.SMTP_PORT);
console.log('SMTP_USER:', process.env.SMTP_USER);
console.log('SMTP_PASS length:', process.env.SMTP_PASS ? process.env.SMTP_PASS.length : 'undefined');
console.log('SMTP_PASS (first 4 chars):', process.env.SMTP_PASS ? process.env.SMTP_PASS.substring(0, 4) : 'undefined');
console.log('SMTP_FROM:', process.env.SMTP_FROM);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DEV_OTP:', process.env.DEV_OTP);

// Test the mailer initialization
const { sendMail } = require('./utils/mailer');
console.log('\nMailer initialized. Testing connection...');

// Wait a bit for initialization
setTimeout(async () => {
  try {
    const result = await sendMail({
      to: '23eg107e37@anurag.edu.in',
      subject: 'SMTP Test from MultiMart',
      html: '<h1>SMTP Test</h1><p>This is a test to verify SMTP configuration.</p>',
      text: 'SMTP Test - This is a test to verify SMTP configuration.'
    });

    if (result) {
      console.log('✅ Email sent successfully!');
    } else {
      console.log('❌ Email sending failed');
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}, 2000);