const jwt = require('jsonwebtoken');

// Generates a signed JWT containing the user's ID, expires in 30 days
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = generateToken;