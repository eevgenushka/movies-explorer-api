require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const auth = require('./middlewares/auth');
const ErrorHandler = require('./errors/ErrorHandler');
const NotFoundError = require('./errors/NotFoundError');
const { createUser, login, logout } = require('./controllers/users');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const {
  validateLogin,
  validateCreateUser,
} = require('./middlewares/celebrate');
const usersRouter = require ('./routes/users')
const moviesRouter = require ('./routes/movies')

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/bitfilmsdb', {
  useNewUrlParser: true,
});

app.use(cors({
  origin: [
    'http://localhost:3001',
    'https://localhost:3001',
    'http://localhost:3000',
    'https://localhost:3000',
    'http://api.movies.nomoredomainsicu.ru',
    'https://api.movies.nomoredomainsicu.ru',
    'http://movies.nomoredomainsicu.ru',
    'https://movies.nomoredomainsicu.ru'
  ],
}));

app.use(requestLogger);
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use('/', express.json());
app.use('/users', auth, usersRouter);
app.use('/movies', auth, moviesRouter);

app.post('/signin', validateLogin, login);
app.post('/signup', validateCreateUser, createUser);
app.post('/signout', logout)
app.use('*', auth, () => {
  throw new NotFoundError('Страницы не существует');
});

app.use(errorLogger);
app.use(errors());
app.use(ErrorHandler);
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});