const express = require('express');
const router = express.Router();
const { addVisit } = require('../controllers/visitController');
const auth = require('../middleware/authMiddleware');

router.post('/add', auth, addVisit);

module.exports = router;
