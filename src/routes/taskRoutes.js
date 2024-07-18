const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { authenticateUser } = require('../middleware/authMiddleware');

router.get('/', authenticateUser, taskController.getAllTasks);
router.post('/', authenticateUser, taskController.createTask);
router.put('/:id', authenticateUser, taskController.updateTask);
router.delete('/:id', authenticateUser, taskController.deleteTask);

module.exports = router;
