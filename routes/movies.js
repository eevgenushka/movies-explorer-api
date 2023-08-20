const moviesRouter = require('express').Router()

const { validateCreateMovie } = require('../middlewares/celebrate')

const {
  getAllMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies')

moviesRouter.get('/', getAllMovies)
moviesRouter.post('/', validateCreateMovie, createMovie)
moviesRouter.delete('/:movieId', deleteMovie)

module.exports = moviesRouter;