const express = require('express');
const cors = require('cors');
const helmet = require('helmet');               // 🛡️ secure headers
const morgan = require('morgan');               // 📜 request logging
const rateLimit = require('express-rate-limit'); // ⏱️ rate limiter
// const xss = require('xss-clean');            // ❌ removed to prevent crash
const pool = require('./db');

const shopRoutes = require('./routes/shopRoutes');
const customerRoutes = require('./routes/customerRoutes');
const authRoutes = require('./routes/authRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();

// ── global middleware ─────────────────────────────
app.use(helmet());
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
// app.use(xss());                               // ❌ removed to prevent crash

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100,
  message: '⛔ Too many requests, please try again later.',
});
app.use(limiter);

// ── routes ────────────────────────────────────────
app.use('/api/shops', shopRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/', (_req, res) => res.send('API Running ✅'));

// ── start server only if not testing ──────────────
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app; // ✅ Needed for Supertest to access Express app
