const usersRouter = require('express').Router();

const { validateUpdateUser } = require('../middlewares/celebrate');

const { getUserById, updateUser } = require('../controllers/users');

usersRouter.get('/me', getUserById);
usersRouter.patch('/me', validateUpdateUser, updateUser);

module.exports = usersRouter;
