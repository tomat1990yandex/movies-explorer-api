const userRouter = require('express').Router();
const { celebrate } = require('celebrate');

const { updateUserJoiObj } = require('../utils/utils');

const { getUserInfo, updateUser } = require('../controllers/users');

userRouter.get('/me', getUserInfo);

userRouter.patch('/me', celebrate({ body: updateUserJoiObj }), updateUser);

module.exports = userRouter;
