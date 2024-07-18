const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authenticateUser } = require('../middlewares/authentication');

router.get('/', categoryController.getAllCategories);
router.get('/mine', authenticateUser, categoryController.getUserCategories);
router.post('/', authenticateUser, categoryController.createCategory);
router.put('/:id', authenticateUser, categoryController.updateCategory);
router.delete('/:id', authenticateUser, categoryController.deleteCategory);

module.exports = router;
