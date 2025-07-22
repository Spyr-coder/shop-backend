const pool = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Register a new shop
exports.registerShop = async (req, res) => {
  console.log('BODY:', req.body);
  const { name, phone, password } = req.body;

  try {
    const shopExists = await pool.query(
      'SELECT id FROM shops WHERE phone = $1',
      [phone]
    );

    if (shopExists.rows.length > 0) {
      return res.status(400).json({ error: 'Shop already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO shops (name, phone, password, subscription_status)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, phone, subscription_status`,
      [name, phone, hashedPassword, 'inactive']
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Register Shop Error:', err);
    res.status(500).json({ error: 'Failed to register shop' });
  }
};

// Login shop and return JWT
exports.loginShop = async (req, res) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    return res
      .status(400)
      .json({ error: 'Phone and password are required.' });
  }

  try {
    const result = await pool.query(
      'SELECT id, name, phone, password, subscription_status FROM shops WHERE phone = $1',
      [phone]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials.' });
    }

    const shop = result.rows[0];
    const validPassword = await bcrypt.compare(password, shop.password);

    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials.' });
    }

    const token = jwt.sign({ id: shop.id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({ token, shop });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
};

// Get shop profile (✅ updated from req.shop to req.user)
exports.getShopProfile = async (req, res) => {
  try {
    const shop = await pool.query(
      'SELECT id, name, phone, subscription_status FROM shops WHERE id = $1',
      [req.user.id] // ✅ FIXED
    );

    if (shop.rows.length === 0) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    res.json(shop.rows[0]);
  } catch (err) {
    console.error('Get Shop Profile Error:', err);
    res.status(500).json({ error: 'Failed to get shop profile' });
  }
};

// Mark subscription as paid (✅ updated from req.shop to req.user)
exports.markPaid = async (req, res) => {
  try {
    const shopId = req.user?.id || req.body.shop_id || 1; // ✅ FIXED

    const result = await pool.query(
      'UPDATE shops SET subscription_status = $1 WHERE id = $2 RETURNING *',
      ['active', shopId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    res.json({
      message: 'Subscription marked as paid ✅',
      shop: result.rows[0],
    });
  } catch (err) {
    console.error('❌ markPaid error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
