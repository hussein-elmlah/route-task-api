const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authenticateUser } = require('../middlewares/authentication');

router.get('/', authenticateUser, categoryController.getAllCategories);
router.post('/', authenticateUser, categoryController.createCategory);
router.put('/:id', authenticateUser, categoryController.updateCategory);
router.delete('/:id', authenticateUser, categoryController.deleteCategory);

module.exports = router;
