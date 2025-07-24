const pool = require('../db');
const QRCode = require('qrcode');

// Register or increment visit
exports.registerCustomer = async (req, res) => {
  console.log('🚀 registerCustomer triggered');
  console.log('🔑 req.user:', req.user); // ✅ FIXED

  const shopId = req.user.id; // ✅ FIXED
  const { name, phone } = req.body;

  console.log('📥 Incoming customer registration:', { name, phone, shopId });

  try {
    const existing = await pool.query(
      'SELECT * FROM customers WHERE phone = $1 AND shop_id = $2',
      [phone, shopId]
    );

    if (existing.rows.length > 0) {
      const customer = existing.rows[0];
      const newVisits = customer.total_visits + 1;
      const newRewards =
        newVisits % 5 === 0 ? customer.total_rewards + 1 : customer.total_rewards;

      const updated = await pool.query(
        'UPDATE customers SET total_visits = $1, total_rewards = $2 WHERE id = $3 RETURNING *',
        [newVisits, newRewards, customer.id]
      );

      const updatedCustomer = updated.rows[0];
      const qr_code = await QRCode.toDataURL(updatedCustomer.phone);

      console.log('🔁 Visit incremented:', updatedCustomer);
      return res.status(200).json({ ...updatedCustomer, qr_code });
    }

    const result = await pool.query(
      'INSERT INTO customers (name, phone, shop_id, total_visits, total_rewards) VALUES ($1, $2, $3, 1, 0) RETURNING *',
      [name, phone, shopId]
    );

    const newCustomer = result.rows[0];
    const qr_code = await QRCode.toDataURL(newCustomer.phone);

    console.log('✅ Customer added:', newCustomer);
    res.status(201).json({ ...newCustomer, qr_code });
  } catch (err) {
    console.error('❌ Register Customer Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get customers
exports.getCustomers = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM customers WHERE shop_id = $1',
      [req.user.id] // ✅ FIXED
    );
    console.log('📦 Customers fetched:', result.rows.length);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('❌ Get Customers Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
