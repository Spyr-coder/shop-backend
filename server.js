// server.js ✅ FINAL LIVE VERSION

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.use(cors({
  origin: 'https://loyal-locks.netlify.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: '⛔ Too many requests, please try again later.',
});
app.use(limiter);

// ✅ ACTUAL ROUTER — not fallback!
const shopRoutes = require('./routes/shopRoutes');
app.use('/api/shops', shopRoutes);

// ✅ Add other routers as needed
// const authRoutes = require('./routes/authRoutes');
// app.use('/api/auth', authRoutes);

app.get('/', (_req, res) => res.send('API Running ✅ LIVE'));

if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

module.exports = app;
