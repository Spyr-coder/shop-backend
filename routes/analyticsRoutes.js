// routes/analyticsRoutes.js
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { getDashboardStats } = require('../controllers/analyticsController');

router.get('/', verifyToken, getDashboardStats);

module.exports = router;
