const jwt = require('jsonwebtoken');
const config = require('../config/env');

function signToken(user) {
  return jwt.sign(
    { sub: String(user.id), role: user.role },
    config.jwtSecret,
    { expiresIn: config.jwtExpires },
  );
}

module.exports = { signToken };
