const { Joi } = require('celebrate');

const linkRegex = /https?:\/\/(www\.)?([\w-]{1,}\.)([\w.~:/?#[\]@!$&'()*+,;=-]{2,})#?/;

const messages = {
  userCreate: 'Переданы некорректные данные при создании пользователя.',
  userReg: 'Такой пользователь уже существует.',
  userAuth: 'Ошибка при авторизации пользователя.',
  userSearch: 'Пользователь по указанному _id не найден.',
  userUpdate: 'Переданы некорректные данные при обновлении профиля.',
  movieSearch: 'Фильм с указанным _id не найден.',
  movieDelete: 'Вы не можете удалять чужие фильмы.',
  movieCreate: 'Переданы некорректные данные при добавлении фильма.',
};

const updateUserJoiObj = Joi.object().keys({
  name: Joi.string().required().min(2).max(30),
  email: Joi.string().required().email(),
});

const createMovieJoiObj = Joi.object().keys({
  country: Joi.string().required().min(2).max(30),
  director: Joi.string().required().min(2).max(30),
  duration: Joi.number().required(),
  year: Joi.string().required().min(4).max(4),
  description: Joi.string().required().min(1),
  image: Joi.string().required().pattern(linkRegex),
  trailer: Joi.string().required().pattern(linkRegex),
  movieId: Joi.number().required(),
  nameRU: Joi.string().required().min(2),
  nameEN: Joi.string().required().min(2),
  thumbnail: Joi.string().required().pattern(linkRegex),
});

const findMovieJoiObj = Joi.object().keys({
  movieId: Joi.string().length(24).hex(),
});

const signupJoiObj = Joi.object().keys({
  email: Joi.string().required().email(),
  password: Joi.string().required().min(8),
  name: Joi.string().required().min(2).max(30),
});

const signinJoiObj = Joi.object().keys({
  email: Joi.string().required().email(),
  password: Joi.string().required().min(8),
});

module.exports = {
  linkRegex,
  messages,
  updateUserJoiObj,
  createMovieJoiObj,
  findMovieJoiObj,
  signupJoiObj,
  signinJoiObj,
};
