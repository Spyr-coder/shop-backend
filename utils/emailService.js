// utils/emailService.js
require('dotenv').config();               // MUST be first
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,        // e.g. jerryotize@gmail.com
    pass: process.env.EMAIL_PASS,        // your app‑password
  },
});

// 🔍  verify connection on boot
transporter.verify((err, success) => {
  if (err) {
    console.error('❌ Email transporter error:', err.message);
  } else {
    console.log('✅ Email transporter ready');
  }
});

module.exports = transporter;
