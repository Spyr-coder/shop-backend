const express = require('express');
const { body } = require('express-validator');          // ✅ NEW
const router = express.Router();

const { verifyToken } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest'); // ✅ NEW
const {
  registerCustomer,
  getCustomers,
} = require('../controllers/customerController');

// Register a new customer (protected + validated)
router.post(
  '/register',
  verifyToken,
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('phone')
      .notEmpty()
      .isMobilePhone()
      .withMessage('Valid phone number required'),
  ],
  validateRequest,              // ✅ NEW
  registerCustomer
);

// Get all customers (protected)
router.get('/', verifyToken, getCustomers);

module.exports = router;
