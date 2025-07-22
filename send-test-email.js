require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const mailOptions = {
  from: process.env.EMAIL_USER,
  to: process.env.FEEDBACK_RECEIVER_EMAIL,
  subject: 'Test Email from Nodemailer',
  text: '🎉 This is a test email sent from your backend!',
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.error('❌ Error sending test email:', error);
  }
  console.log('✅ Email sent:', info.response);
});
