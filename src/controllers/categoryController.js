const Category = require('../models/Category.js');
const CustomError = require('../lib/customError.js');
const { handleQueryParams } = require('../utils/handleQueryParams.js');
const Task = require('../models/Task.js');

const checkDuplicateCategoryName = async (name, userId, excludeId = null) => {
  const conditions = { name, user: userId };
  if (excludeId) {
    conditions._id = { $ne: excludeId };
  }
  const existingCategory = await Category.findOne(conditions);
  if (existingCategory) {
    throw new CustomError('Category with the same name already exists for this user', 400);
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const result = await handleQueryParams(Category, req.query, 'name');
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

exports.getUserCategories = async (req, res) => {
  try {
    req.query.user = req.user._id;
    const result = await handleQueryParams(Category, req.query, 'name');
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const name = req.body.name.toLowerCase();
    await checkDuplicateCategoryName(name, req.user._id);
    const newCategory = new Category({ name, user: req.user._id });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const name = req.body.name.toLowerCase();
    await checkDuplicateCategoryName(name, req.user._id, id);
    const updatedCategory = await Category.findByIdAndUpdate(id, { name }, { new: true });
    if (!updatedCategory) {
      throw new CustomError('Category not found', 404);
    }
    res.json(updatedCategory);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
    try {
      const { id } = req.params;
      const tasksWithCategory = await Task.findOne({ category: id });
      if (tasksWithCategory) {
        throw new CustomError("Category cannot be deleted because it is being used in tasks", 400);
      }
  
      const deletedCategory = await Category.findByIdAndDelete(id);
      if (!deletedCategory) {
        throw new CustomError('Category not found', 404);
      }
      res.json({ message: 'Category deleted successfully' });
    } catch (error) {
      res.status(error.status || 500).json({ message: error.message });
    }
  };
