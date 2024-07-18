const Task = require('../models/Task.js');
const CustomError = require('../lib/customError.js');
const { handleQueryParams } = require('../utils/handleQueryParams.js');

exports.getAllTasks = async (req, res, next) => {
  try {
    const result = await handleQueryParams(Task, req.query, 'title');
    res.json(result);
  } catch (error) {
    next(error);
  }
};

exports.createTask = async (req, res, next) => {
  try {
    const { title, description, type, shared, category } = req.body;

    const newTask = await Task.create({ title, description, type, shared, category });

    res.status(201).json(newTask);
  } catch (error) {
    next(error);
  }
};

exports.updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, type, shared, category } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { title, description, type, shared, category },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      throw new CustomError('Task not found', 404);
    }

    res.json(updatedTask);
  } catch (error) {
    next(error);
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      throw new CustomError('Task not found', 404);
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
};
