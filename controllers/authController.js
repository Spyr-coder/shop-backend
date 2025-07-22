const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new shop
exports.registerShop = async (req, res) => {
  const { name, phone, password } = req.body;

  try {
    const hashed = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO shops (name, phone, password) VALUES ($1, $2, $3) RETURNING *',
      [name, phone, hashed]
    );

    res.status(201).json({ shop: result.rows[0] });
  } catch (err) {
    console.error('Register Error:', err);
    res.status(500).json({ error: 'Failed to register shop' });
  }
};

// Login shop (with JWT)
exports.loginShop = async (req, res) => {
  const { phone, password } = req.body;

  try {
    const { rows } = await pool.query(
      'SELECT * FROM shops WHERE phone = $1',
      [phone]
    );

    const shop = rows[0];

    if (!shop) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    const valid = await bcrypt.compare(password, shop.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ id: shop.id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.json({
      id: shop.id,
      name: shop.name,
      phone: shop.phone,
      token,
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
};
