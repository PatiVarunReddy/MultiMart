const { sendMail } = require('./utils/mailer');

// Test email function
async function sendTestEmail() {
  try {
    console.log('Sending test email...');

    const result = await sendMail({
      to: '23eg107e37@anurag.edu.in',
      subject: 'Test Email from MultiMart',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4f46e5;">MultiMart Test Email</h2>
          <p>Hello!</p>
          <p>This is a test email to verify that the OTP email system is working correctly.</p>
          <p>If you received this email, the SMTP configuration is working properly.</p>
          <p>Time sent: ${new Date().toLocaleString()}</p>
          <br>
          <p>Best regards,<br>MultiMart Team</p>
        </div>
      `,
      text: `MultiMart Test Email

Hello!

This is a test email to verify that the OTP email system is working correctly.

If you received this email, the SMTP configuration is working properly.

Time sent: ${new Date().toLocaleString()}

Best regards,
MultiMart Team`
    });

    if (result) {
      console.log('✅ Test email sent successfully!');
      console.log('Message ID:', result.messageId);
    } else {
      console.log('❌ Failed to send test email');
    }
  } catch (error) {
    console.error('❌ Error sending test email:', error.message);
  }
}

// Run the test
sendTestEmail();