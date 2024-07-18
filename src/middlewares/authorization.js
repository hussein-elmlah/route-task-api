const CustomError = require('../lib/customError.js');
const Category = require('../models/Category.js');
const Task = require('../models/Task.js');

const categoryAuthorization = async (req, res, next) => {
  const categoryId = req.params.id;
  console.log("categoryId :", categoryId)
  const loggedUserId = req.user._id;
  console.log("loggedUserId :", loggedUserId)

  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      throw new CustomError('Category not found', 404);
    }

    if (category.user.toString() !== loggedUserId.toString()) {
      throw new CustomError('Unauthorized - You are not the owner of this category', 403);
    }

    next();
  } catch (error) {
    next(error);
  }
};

const taskAuthorization = async (req, res, next) => {
  const taskId = req.params.id;
  const loggedUserId = req.user._id;

  try {
    const task = await Task.findById(taskId);
    if (!task) {
      throw new CustomError('Task not found', 404);
    }

    if (task.user.toString() !== loggedUserId.toString()) {
      throw new CustomError('Unauthorized - You are not the owner of this task', 403);
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  categoryAuthorization,
  taskAuthorization,
};
