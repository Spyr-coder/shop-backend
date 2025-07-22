const jwt = require('jsonwebtoken');

function generateToken(shop) {
  return jwt.sign(
    { id: shop.id, phone: shop.phone }, 
    process.env.JWT_SECRET,
    { expiresIn: '7d' } // valid for 7 days
  );
}

module.exports = generateToken;
