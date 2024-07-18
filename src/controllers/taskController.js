const Category = require('../models/Category.js');
const CustomError = require('../lib/customError.js');
const { handleQueryParams } = require('../utils/queryHelpers.js');

exports.getAllCategories = async (req, res, next) => {
  try {
    const result = await handleQueryParams(Category, req.query, 'name');
    res.json(result);
  } catch (error) {
    next(error);
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const userId = req.user._id;

    const newCategory = await Category.create({ name, userId });

    res.status(201).json(newCategory);
  } catch (error) {
    next(error);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      throw new CustomError('Category not found', 404);
    }

    res.json(updatedCategory);
  } catch (error) {
    next(error);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      throw new CustomError('Category not found', 404);
    }

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    next(error);
  }
};
