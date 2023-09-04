require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const ErrorHandler = require('./errors/ErrorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const routers = require('./routes');

const { PORT = 3000, DB_ADDRESS = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;

const app = express();

mongoose.connect(DB_ADDRESS, {
  useNewUrlParser: true,
});

app.use(cors({
  origin: [
    'http://localhost:3001',
    'https://localhost:3001',
    'http://localhost:3000',
    'https://localhost:3000',
    'http://api.movies.nomoredomainsicu.ru',
    'http://api.movies.nomoredomainsicu.ru/signin',
    'http://api.movies.nomoredomainsicu.ru/signup',
    'https://api.movies.nomoredomainsicu.ru',
    'https://api.movies.nomoredomainsicu.ru/signin',
    'https://api.movies.nomoredomainsicu.ru/signup',
    'http://movies.nomoredomainsicu.ru',
    'https://movies.nomoredomainsicu.ru',
  ],
}));

app.use(helmet());

app.use('/', express.json());
app.use(requestLogger);
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(routers);
app.use(errorLogger);
app.use(ErrorHandler);
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
