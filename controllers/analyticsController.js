// controllers/analyticsController.js
const pool = require('../db');

exports.getDashboardStats = async (req, res) => {
  const shopId = req.shop.id;

  try {
    // 1. Total visits this month
    const monthResult = await pool.query(
      `SELECT COALESCE(SUM(total_visits), 0) AS total_visits_month
       FROM customers
       WHERE shop_id = $1 AND DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)`,
      [shopId]
    );

    // 2. Total visits this week
    const weekResult = await pool.query(
      `SELECT COALESCE(SUM(total_visits), 0) AS total_visits_week
       FROM customers
       WHERE shop_id = $1 AND DATE_TRUNC('week', created_at) = DATE_TRUNC('week', CURRENT_DATE)`,
      [shopId]
    );

    // 3. Top 3 returning customers
    const topResult = await pool.query(
      `SELECT name, phone, total_visits
       FROM customers
       WHERE shop_id = $1
       ORDER BY total_visits DESC
       LIMIT 3`,
      [shopId]
    );

    // 4. Total rewards given
    const rewardsResult = await pool.query(
      `SELECT COALESCE(SUM(total_rewards), 0) AS total_rewards
       FROM customers
       WHERE shop_id = $1`,
      [shopId]
    );

    res.json({
      week: weekResult.rows[0].total_visits_week,
      month: monthResult.rows[0].total_visits_month,
      rewards: rewardsResult.rows[0].total_rewards,
      top_customers: topResult.rows,
    });
  } catch (err) {
    console.error('❌ Dashboard analytics error:', err);
    res.status(500).json({ error: 'Failed to load analytics' });
  }
};
