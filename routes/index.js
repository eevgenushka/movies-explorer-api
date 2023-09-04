const routers = require('express').Router();

const { errors } = require('celebrate');
const { createUser, login, logout } = require('../controllers/users');
const {
  validateLogin,
  validateCreateUser,
} = require('../middlewares/celebrate');
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const NotFoundError = require('../errors/NotFoundError');
const auth = require('../middlewares/auth');

routers.use('/users', auth, usersRouter);
routers.use('/movies', auth, moviesRouter);

routers.post('/signin', validateLogin, login);
routers.post('/signup', validateCreateUser, createUser);
routers.post('/signout', logout);
routers.use('*', auth, () => {
  throw new NotFoundError('Страницы не существует');
});

routers.use(errors());

module.exports = routers;
