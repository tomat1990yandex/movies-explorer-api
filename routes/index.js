const router = require('express').Router();
const { celebrate } = require('celebrate');

const SearchError = require('../errors/search-err');

const { signupJoiObj, signinJoiObj } = require('../utils/utils');

const auth = require('../middlewares/auth');

const { createUser, login, logout } = require('../controllers/users');

const userRouter = require('./users');
const movieRouter = require('./movies');

router.post('/signup', celebrate({ body: signupJoiObj }), createUser);
router.post('/signin', celebrate({ body: signinJoiObj }), login);
router.post('/signout', auth, logout);

router.use('/users', auth, userRouter);
router.use('/movies', auth, movieRouter);

router.use('*', auth, () => {
  throw new SearchError('Страницы по запрашиваемому адресу не существует');
});

module.exports = router;
