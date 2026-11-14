const authService = require('../services/auth.service');

async function register(req, res) {
  const { user, token } = await authService.register(req.body);
  res.status(201).json({
    message: 'User registered successfully',
    token,
    user,
  });
}

module.exports = { register };
