// server.js ✅ FINAL SAFE FALLBACK VERSION

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

// ✅ Fallback critical routes (no dynamic param!)
app.post('/api/shops/register', (req, res) => {
  console.log('Register fallback hit:', req.body);
  res.json({ message: '✅ Register fallback OK' });
});

app.post('/api/shops/login', (req, res) => {
  console.log('Login fallback hit:', req.body);
  res.json({ message: '✅ Login fallback OK' });
});

// ✅ Comment out broken routers until found!
/*
const shopRoutes = require('./routes/shopRoutes');
app.use('/api/shops', shopRoutes);

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);
*/

app.get('/', (_req, res) => res.send('API Running ✅ SAFE FALLBACK'));

if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

module.exports = app;
