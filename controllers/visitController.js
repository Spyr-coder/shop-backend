const pool = require('../db');
const { sendSMS } = require('../utils/sendSMS');

// Add visit by scanning QR code
exports.addVisit = async (req, res) => {
  try {
    const { qrData } = req.body; // Expects: "customer:123"
    const shopId = req.user.id;

    // 🔐 Check subscription status
    const statusRes = await pool.query(
      'SELECT subscription_status FROM shops WHERE id = $1',
      [shopId]
    );

    if (statusRes.rows[0].subscription_status !== 'active') {
      return res.status(403).json({ error: 'Subscription inactive. Please pay.' });
    }

    const customerId = qrData.split(':')[1];

    // Insert visit
    await pool.query(
      'INSERT INTO visits (customer_id, shop_id) VALUES ($1, $2)',
      [customerId, shopId]
    );

    // Count total visits for this customer
    const result = await pool.query(
      'SELECT COUNT(*) FROM visits WHERE customer_id = $1',
      [customerId]
    );
    const totalVisits = parseInt(result.rows[0].count);

    // Example: reward every 5 visits
    if (totalVisits % 5 === 0) {
      await pool.query(
        'INSERT INTO rewards (customer_id, shop_id, reward_type) VALUES ($1, $2, $3)',
        [customerId, shopId, 'Free Service']
      );

      // Send SMS
      const phoneResult = await pool.query(
        'SELECT phone FROM customers WHERE id = $1',
        [customerId]
      );
      const customerPhone = phoneResult.rows[0].phone;

      await sendSMS(customerPhone, `Congrats! You earned a reward for ${totalVisits} visits.`);
    }

    res.json({ msg: 'Visit recorded', totalVisits });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
