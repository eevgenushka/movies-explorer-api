const moviesRouter = require('express').Router();

const { validateCreateMovie, validateDeleteMovie } = require('../middlewares/celebrate');

const {
  getAllMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

moviesRouter.get('/', getAllMovies);
moviesRouter.post('/', validateCreateMovie, createMovie);
moviesRouter.delete('/:movieId', validateDeleteMovie, deleteMovie);

module.exports = moviesRouter;
