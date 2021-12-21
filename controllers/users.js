const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const {
  SECRET_KEY_DEV, NODE_ENV, JWT_SECRET, cookieConfig,
} = require('../utils/config');

const { messages } = require('../utils/utils');

const SearchError = require('../errors/search-err');
const DataError = require('../errors/data-err');
const RegisterError = require('../errors/register-err');
const AuthError = require('../errors/auth-err');

const {
  userCreate, userReg, userAuth, userSearch, userUpdate,
} = messages;

async function getUserInfo(req, res, next) {
  const id = req.user._id;
  let user;

  try {
    user = await User.findById(id);

    if (!user) {
      throw new SearchError(userSearch);
    }

    res.send({ email: user.email, name: user.name });
  } catch (e) {
    next(e);
  }
}

async function updateUser(req, res, next) {
  const id = req.user._id;
  const { name, email } = req.body;
  let user;

  try {
    user = await User.findByIdAndUpdate(id, { name, email }, {
      new: true,
      runValidators: true,
      upsert: false,
    });

    if (!user) {
      throw new SearchError(userSearch);
    }

    res.send({ email: user.email, name: user.name });
  } catch (e) {
    if (e.name === 'ValidationError') {
      const error = new DataError(userUpdate);
      next(error);
    } else if (e.name === 'MongoError') {
      const error = new RegisterError(userReg);
      next(error);
    }
    next(e);
  }
}

async function createUser(req, res, next) {
  const { email, password, name } = req.body;

  let hash;
  let user;

  try {
    if (!email || !password) {
      throw new DataError(userCreate);
    }

    hash = await bcrypt.hash(password, 10);

    try {
      user = await User.create({
        email, password: hash, name,
      });
      res.status(201).send({
        _id: user._id,
        email: user.email,
        name: user.name,
      });
    } catch (e) {
      if (e.name === 'ValidationError') {
        const error = new DataError(userCreate);
        next(error);
      } else if (e.name === 'MongoError') {
        const error = new RegisterError(userReg);
        next(error);
      }
      next(e);
    }
  } catch (e) {
    next(e);
  }
}

async function login(req, res, next) {
  const { email, password } = req.body;
  let user;

  try {
    user = await User.findUserByCredentials(email, password);

    const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : SECRET_KEY_DEV, { expiresIn: '7d' });

    res.cookie('token', token, cookieConfig).send({ message: `Добро пожаловать, ${user.name}!` });
  } catch (e) {
    const error = new AuthError(userAuth);
    next(error);
  }
}

function logout(req, res) {
  return res.clearCookie('token').send({ message: 'Вы вышли из личного кабинета.' });
}

module.exports = {
  getUserInfo,
  updateUser,
  createUser,
  login,
  logout,
};
