for (const key of ['JWT_SECRET', 'PORT']) {
  if (!process.env[key]) {
    throw new Error(`Missing the required env variable: ${key}`);
  }
}

const config = {
  port: Number(process.env.PORT),
  jwtSecret: process.env.JWT_SECRET,
  jwtExpires: process.env.JWT_EXPIRES || '1d',
};

module.exports = config;
