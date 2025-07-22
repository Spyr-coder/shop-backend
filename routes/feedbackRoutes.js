const express = require('express');
const { body } = require('express-validator');          // ✅ NEW
const router = express.Router();

const { verifyToken } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest'); // ✅ NEW
const { createFeedback } = require('../controllers/feedbackController');

router.post(
  '/',
  verifyToken,
  // admin‑only inline check
  (req, res, next) => {
    if (req.shop.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden — Admins only' });
    }
    next();
  },
  // validation rules
  [body('message').notEmpty().withMessage('Message is required')],
  validateRequest,              // ✅ NEW
  createFeedback
);

module.exports = router;
