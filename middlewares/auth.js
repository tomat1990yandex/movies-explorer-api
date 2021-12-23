const jwt = require('jsonwebtoken');

const {
  JWT_SECRET,
  NODE_ENV,
} = require('../utils/config');

const AuthError = require('../errors/auth-err');

module.exports = (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    throw new AuthError('Необходима авторизация');
  }

  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    const error = new AuthError('Необходима авторизация auth');
    next(error);
  }

  req.user = payload;

  next();
};
