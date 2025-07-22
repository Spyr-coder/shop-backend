const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { markPaid } = require('../controllers/shopController');

// Other routes...
router.post('/mark-paid', auth, markPaid);

module.exports = router;
