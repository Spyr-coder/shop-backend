const jwt = require('jsonwebtoken');
const pool = require('../db'); // ✅ Add DB connection to fetch role

exports.verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log('🔒 Auth Header:', authHeader); // ← debug #1

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Decoded payload:', decoded); // ← debug #2

    // ✅ Fetch role from DB
    const result = await pool.query(
      'SELECT role FROM shops WHERE id = $1',
      [decoded.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    req.shop = {
      id: decoded.id,
      role: result.rows[0].role,
    };

    next();
  } catch (err) {
    console.error('❌ Token verification error:', err.message);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
