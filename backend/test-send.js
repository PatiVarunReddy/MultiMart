require('dotenv').config();
const { sendMail } = require('./utils/mailer');

(async () => {
  try {
    console.log('Running test-send.js — attempting to send test email (to: 23eg107e46@anurag.edu.in)');
    const res = await sendMail({
      to: '23eg107e46@anurag.edu.in',
      subject: 'MultiMart test email',
      text: 'This is a test email from MultiMart (backend test-send.js).',
      html: '<p>This is a test email from <strong>MultiMart</strong> (backend test-send.js).</p>'
    });
    console.log('sendMail result:', !!res);
    process.exit(0);
  } catch (err) {
    console.error('Error in test-send:', err && err.message ? err.message : err);
    process.exit(1);
  }
})();
