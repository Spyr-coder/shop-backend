// routes/shopRoutes.js
const express = require('express');
const router = express.Router();
const {
  registerShop,
  loginShop,
  getShopProfile,
  markPaid,
} = require('../controllers/shopController');

const { verifyToken } = require('../middleware/authMiddleware');

router.post('/register', registerShop);
router.post('/login', loginShop);
router.get('/profile', verifyToken, getShopProfile);
router.post('/mark-paid', verifyToken, markPaid); // ✅ This is the one!

module.exports = router;
