const Movies = require('../models/movie');

const NotFoundError = require('../errors/NotFoundError');
const NoRightsError = require('../errors/NoRightsError');
const BadRequestError = require('../errors/BadRequestError');

function getAllMovies (req, res, next) {
  Movies
    .find({ owner: req.user._id })
    .then((movies) => res.send(movies.reverse()))
    .catch(next);
};

function createMovie (req, res, next) {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  Movies
    .create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      owner: req.user._id,
      movieId,
      nameRU,
      nameEN,
    })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new NotFoundError('Переданны некорректные данные'));
      }

      return next(err);
    });
};

function deleteMovie (req, res, next) {
  const { movieId } = req.params;

  Movies
    .findById(movieId)
    .orFail(new BadRequestError(`Фильм с таким Id: ${movieId} не найден`))
    .then((movie) => {
      if (movie.owner.toString() !== req.user._id) {
        return next(new NoRightsError('Нет прав на удаление чужого фильма'));
      }

      return movie;
    })
    .then((movie) => Movies.deleteOne(movie))
    .then(() => res.status(200).send({ message: 'Фильм удален' }))
    .catch(next);
};

module.exports = {
  getAllMovies,
  deleteMovie,
  createMovie
}