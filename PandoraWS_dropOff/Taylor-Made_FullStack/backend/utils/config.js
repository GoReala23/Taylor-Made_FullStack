const { NODE_ENV, JWT_SECRET = 'super-strong-secret' } = process.env;

module.exports = {
  NODE_ENV,
  JWT_SECRET: NODE_ENV === 'production' ? JWT_SECRET : 'super-strong-secret',
};
