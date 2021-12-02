require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors, celebrate, Joi } = require('celebrate');
const { apiLogger, errLogger } = require('./middlewares/logger');
const handlerError = require('./errors/handlerError');

const usersRoutes = require('./routes/users');
const moviesRoutes = require('./routes/movies');

const { loginUser, createUser } = require('./controllers/usersController');
const auth = require('./middlewares/auth');
const { NotFoundError } = require('./errors/notFoundError');

const { PORT = 3000 } = process.env;

const app = express();

app.use(cors());

mongoose.connect(
  'mongodb://localhost:27017/bitfilmsdb',
  async (err) => {
    if (err) throw err;
    console.log('connected to db');
  },
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(apiLogger);

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  loginUser,
);

app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  createUser,
);

app.use('/', auth, usersRoutes);
app.use('/', auth, moviesRoutes);
app.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.use(errLogger);
app.use(errors());

app.use(handlerError);

app.listen(PORT, () => {
  console.log(`Movie Explorer Backend is listening on port ${PORT}`);
});
