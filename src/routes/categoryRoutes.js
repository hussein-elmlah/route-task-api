const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authenticateUser } = require('../middlewares/authentication');
const { categoryAuthorization } = require('../middlewares/authorization');

router.get('/', categoryController.getAllCategories);
router.get('/self', authenticateUser, categoryController.getUserCategories);
router.post('/', authenticateUser, categoryController.createCategory);
router.put('/:id', authenticateUser, categoryAuthorization, categoryController.updateCategory);
router.delete('/:id', authenticateUser, categoryAuthorization, categoryController.deleteCategory);

module.exports = router;
