const pool = require('../db');
const transporter = require('../utils/emailService');   // ✅ use shared transporter

// ── POST /api/feedback ───────────────────────────────────
exports.createFeedback = async (req, res) => {
  const shopId = req.shop.id;            // set by verifyToken
  const { message } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    // 1. save to DB
    await pool.query(
      'INSERT INTO feedback (shop_id, message) VALUES ($1, $2)',
      [shopId, message]
    );

    // 2. e‑mail it
    console.log('📨 Sending feedback e‑mail…');
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.FEEDBACK_RECEIVER_EMAIL,
      subject: `📝 New feedback from shop ${shopId}`,
      text: message,
    });
    console.log('✅ Feedback e‑mail sent');
console.log('📧 Sending email to:', process.env.FEEDBACK_RECEIVER_EMAIL);

    res.status(201).json({ msg: 'Feedback sent — thank you!' });
  } catch (err) {
    console.error('❌ Feedback error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};




