const { NODE_ENV, JWT_SECRET_KEY } = process.env;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { MONGO_DUPLICATE_ERROR_CODE, SALT_ROUNDS } = require('../utils/constants');
const User = require('../models/user');

const { NotFoundError } = require('../errors/notFoundError');
const { ConflictError } = require('../errors/conflictError');
const { ValidationError } = require('../errors/validationError');
const { AuthError } = require('../errors/authError');

const getProfile = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Запрашиваемый пользователь не найден'));
      }
      res.send(user);
    })
    .catch((err) => next(err));
};

const updateProfile = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        next(new ValidationError('Переданы не корректные данные'));
      }
      res.send({ name: user.name, email: user.email });
    })
    .catch(() => {
      next(new ConflictError('Пользователь с таким email уже зарегистрирован'));
    });
};

const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  if (!email || !password) {
    next(new ValidationError('Не переданы email или пароль'));
  }
  bcrypt
    .hash(password, SALT_ROUNDS)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => {
      res.send({ message: `Пользователь ${user.name} успешно зарегистрирован. E-mail: ${user.email}` });
    })
    .catch((err) => {
      if (err.code === MONGO_DUPLICATE_ERROR_CODE) {
        next(new ConflictError('Пользователь с таким email уже зарегистрирован'));
      } else {
        next(err);
      }
    });
};

const loginUser = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET_KEY : 'dev-secret',
        { expiresIn: '7d' },
      );
      return res.send({ token });
    })
    .catch(() => {
      next(new AuthError('неверный email или пароль!'));
    });
};

module.exports = {
  getProfile,
  updateProfile,
  createUser,
  loginUser,
};
