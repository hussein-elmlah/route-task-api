const express = require('express');

const router = express.Router();
const UsersController = require('../controllers/usersController');
const asyncWrapper = require('../lib/async-wrapper');
const generateToken = require('../utils/jwtUtils');

const { authenticateUser } = require('../middlewares/authentication');

router.post('/register', async (req, res, next) => {
  const [err, user] = await asyncWrapper(UsersController.createUser(req.body));
  if (err) {
    return next(err);
  }
  const token = generateToken(user);

  res.status(201).json({ user, token });
});

router.post('/login', async (req, res, next) => {
  const [err, user] = await asyncWrapper(
    UsersController.loginUser({ req }),
  );
  if (err) {
    return next(err);
  }
  res.json(user);
});

router.post('/logout', authenticateUser, async (req, res, next) => {
  const { authorization: token } = req.headers;
  const [err] = await asyncWrapper(UsersController.logoutUser({ token }));
  if (err) {
    return next(err);
  }
  res.json({ message: 'Logout successful' });
});

router.get('/', authenticateUser, async (req, res, next) => {
  const userId = req.user._id;
  const [err, user] = await asyncWrapper(UsersController.getUser(userId));
  if (err) {
    return next(err);
  }
  res.json(user);
});


module.exports = router;
