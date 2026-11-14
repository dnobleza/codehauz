const bcrypt = require('bcryptjs');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');
const User = require('../models/user.model');
const { validateRegisterInput } = require('../utils/validation');
const { signToken } = require('../utils/token');

function toPublicUser(user) {
  const { passwordHash, ...publicUser } = user;
  return publicUser;
}

async function register(body) {
  logger.debug('register: start');

  const { name, mobile, email, password } = validateRegisterInput(body);
  logger.debug('register: input valid');

  if (await User.findByEmail(email)) {
    logger.debug('register: email taken');
    throw new AppError(409, 'Email already registered');
  }

  if (await User.findByMobile(mobile)) {
    logger.debug('register: mobile taken');
    throw new AppError(409, 'Mobile number already registered');
  }

  logger.debug('register: no duplicates, hashing password');
  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.createUser({ name, mobile, email, passwordHash });
  logger.info(`User registered: id=${user.id}`);

  const token = signToken(user);

  return { user: toPublicUser(user), token };
}

module.exports = { register };
