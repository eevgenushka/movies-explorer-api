const jwt = require('jsonwebtoken');
const ValidationError = require('../errors/ValidationError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new ValidationError('Необходима авторизация!'));
    return;
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key');
  } catch (err) {
    next(new ValidationError('Необходима авторизация!'));
    return;
  }

  req.user = payload;

  next();
};
