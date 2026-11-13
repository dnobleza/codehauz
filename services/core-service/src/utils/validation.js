const AppError = require('./AppError');
const { email_regex, mobile_regex } = require('./regex.js');

function isValidEmail(email) {
  if (typeof email !== 'string') {
    return false;
  }
  return email_regex.test(email);
}

function isValidMobile(mobile) {
  if (typeof mobile !== 'string') {
    return false;
  }
  return mobile_regex.test(mobile);
}

function normalizeMobile(mobile) {
  const trimmed = mobile.trim();
  if (trimmed.startsWith('0')) {
    return '+63' + trimmed.slice(1);
  }
  return trimmed;
}

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function validateRegisterInput(body) {
  const { name, mobile, email, password } = body || {};

  const fields = [name, mobile, email, password];
  const isMissing = fields.some(
    (field) => typeof field !== 'string' || field.trim() === '',
  );
  if (isMissing) {
    throw new AppError(400, 'Name, mobile, email and password are required');
  }

  if (!isValidEmail(email.trim())) {
    throw new AppError(400, 'Invalid email format');
  }

  if (!isValidMobile(mobile.trim())) {
    throw new AppError(400, 'Invalid mobile number');
  }

  if (password.length < 8) {
    throw new AppError(400, 'Password must be at least 8 characters');
  }

  return {
    name: name.trim(),
    mobile: normalizeMobile(mobile),
    email: normalizeEmail(email),
    password,
  };
}

module.exports = {
  isValidEmail,
  normalizeMobile,
  normalizeEmail,
  isValidMobile,
  validateRegisterInput,
};
