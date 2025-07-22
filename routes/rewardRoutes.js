const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getRewards, redeemReward } = require('../controllers/rewardController');

router.get('/', auth, getRewards);
router.post('/redeem', auth, redeemReward);

module.exports = router;
