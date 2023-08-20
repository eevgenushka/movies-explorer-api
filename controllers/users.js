const { NODE_ENV, JWT_SECRET } = process.env
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const NotFoundError = require('../errors/NotFoundError');
const AlreadyExistError = require('../errors/NoRightsError');
const BadRequestError = require('../errors/BadRequestError');
const ValidationError = require('../errors/ValidationError');

function login (req, res, next) {
  const { email, password } = req.body

  return User
    .findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return next(
          new ValidationError('Неверный адрес электронной почты или пароль')
        )
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return next(
            new ValidationError('Неверный адрес электронной почты или пароль')
          )
      }
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',
          { expiresIn: '7d' }
        )
        return res.status(200).send({
          _id: user._id,
          name: user.name,
          email: user.email,
    })
      })
    })
    .catch(next)
}

function createUser (req, res, next) {
  const { name, email, password } = req.body
  bcrypt
    .hash(password, 10)
    .then((hash) =>
    User.create({
        name,
        email,
        password: hash,
      })
    )
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(
          new AlreadyExistError(
            'Пользователь с таким адресом электронной почты уже зарегистрирован'
          )
        )
      }

      if (err.name === 'ValidationError') {
        return next(new NotFoundError('Отправленные некорректные данные'))
      }

      return next(err)
    })
}


function getUserById (req, res, next) {
  const userId = req.user._id
  User
    .findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new NotFoundError('Отправленные некорректные данные'))
      }
      if (err.name === 'DocumentNotFoundError') {
        return next(
          new BadRequestError(`Пользователь с таким Id: ${userId} не найден`)
        )
      }
      return next(res)
    })
}

function updateUser (req, res, next) {
  const { name, email } = req.body

  User
    .findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true, runValidators: true }
    )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.code === 11000) {
        return next(
          new AlreadyExistError(
            'Пользователь с таким адресом электронной почты уже зарегистрирован'
          )
        )
      }
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return next(new NotFoundError('Отправленные некорректные данные'))
      }
      return next(err)
    })
};

function logout (req, res) {
  req.session.destroy(() => {
    res.send({ message: 'Выход пользователя.' });
  });
};

module.exports = {
  login,
  createUser,
  getUserById,
  updateUser,
  logout
}