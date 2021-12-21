const movieRouter = require('express').Router();
const { celebrate } = require('celebrate');

const { createMovieJoiObj, findMovieJoiObj } = require('../utils/utils');

const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');

movieRouter.get('/', getMovies);

movieRouter.post('/', celebrate({ body: createMovieJoiObj }), createMovie);

movieRouter.delete('/:movieId', celebrate({ params: findMovieJoiObj }), deleteMovie);

module.exports = movieRouter;
