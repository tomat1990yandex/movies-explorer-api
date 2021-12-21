const Movie = require('../models/movie');

const SearchError = require('../errors/search-err');
const DataError = require('../errors/data-err');
const RightsError = require('../errors/rights-err');

const { messages } = require('../utils/utils');

const { movieSearch, movieDelete, movieCreate } = messages;

async function getMovies(req, res, next) {
  const currentUserId = req.user._id;
  let movies;

  try {
    movies = await Movie.find({ owner: currentUserId });
    res.send(movies);
  } catch (e) {
    next(e);
  }
}

async function createMovie(req, res, next) {
  const {
    country, director, duration, year, description,
    image, trailer, nameRU, nameEN, thumbnail, movieId,
  } = req.body;
  const owner = req.user;
  let movie;

  try {
    movie = await Movie.create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailer,
      nameRU,
      nameEN,
      thumbnail,
      movieId,
      owner,
    });
    res.status(201).send(movie);
  } catch (e) {
    if (e.name === 'ValidationError') {
      const error = new DataError(movieCreate);
      next(error);
    }
    next(e);
  }
}

async function deleteMovie(req, res, next) {
  const id = req.params.movieId;
  const currentUserId = req.user._id;
  let movie;
  let movieData;

  try {
    movie = await Movie.findById(id);

    if (!movie) {
      throw new SearchError(movieSearch);
    }

    const { owner } = movie;

    if (!owner.equals(currentUserId)) {
      throw new RightsError(movieDelete);
    }

    movieData = await Movie.deleteOne({ _id: id });

    if (!movieData) {
      throw new Error('Не удалось удалить фильм');
    }

    res.send({ data: movieData });
  } catch (e) {
    if (e.name === 'CastError') {
      const error = new SearchError(movieSearch);
      next(error);
    }
    next(e);
  }
}

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
