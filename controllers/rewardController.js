const pool = require('../db');

// Get all rewards for a shop owner
exports.getRewards = async (req, res) => {
  try {
    const shopId = req.user.id;

    const result = await pool.query(
      `SELECT r.*, c.name AS customer_name, c.phone
       FROM rewards r
       JOIN customers c ON r.customer_id = c.id
       WHERE r.shop_id = $1
       ORDER BY r.redeemed_at DESC`,
      [shopId]
    );

    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch rewards' });
  }
};

// Manually redeem a reward (optional flow)
exports.redeemReward = async (req, res) => {
  try {
    const { customerId, rewardType } = req.body;
    const shopId = req.user.id;

    const result = await pool.query(
      `INSERT INTO rewards (customer_id, shop_id, reward_type)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [customerId, shopId, rewardType]
    );

    res.json({ msg: 'Reward redeemed', reward: result.rows[0] });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to redeem reward' });
  }
};
