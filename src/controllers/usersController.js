const mongoose = require('mongoose');
const User = require('../models/User');
const CustomError = require('../lib/customError');
const generateToken = require('../utils/jwtUtils');
const { revokeToken } = require('../utils/revokedTokens');

exports.createUser = async ({ fullName, email, password }) => {
  try {
    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) {
      throw new CustomError(
        `Failed to create user: The email '${email}' already exists.`,
        409,
      );
    }
    const user = await User.create({ fullName, email, password });
    return user;
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    } else throw new CustomError(`Failed to create user: ${error.message}`, 500);
  }
};

exports.loginUser = async ({ req }) => {
  const { body: { email, password } } = req;
  const user = await User.findOne({ email }).exec();
  if (!user) {
    throw new CustomError('UN_Authenticated', 401);
  }

  const valid = user.verifyPassword(password);

  if (!valid) {
    throw new CustomError('UN_Authenticated', 401);
  }
  const token = generateToken(user);
  return token;
};

exports.logoutUser = async ({ token }) => {
  await revokeToken(token);
  return true;
};

exports.deleteUser = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new CustomError('Invalid id format', 400);
  }
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    throw new CustomError('User not found', 404);
  }
};

exports.updateUser = async (id, { fullName, email, password }) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new CustomError('Invalid id format', 400);
  }
  const user = await User.findByIdAndUpdate(
    id,
    {
      fullName,
      email,
      password,
    },
    { new: true },
  );
  if (!user) {
    throw new CustomError('User not found', 404);
  }
  return user;
};

exports.getUser = async (userId) => {
  const user = await User.findById(userId).select('fullName email -_id');
  if (!user) {
    throw new CustomError('User not found', 404);
  }
  return user;
};
