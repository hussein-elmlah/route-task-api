const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { authenticateUser } = require('../middlewares/authentication');

router.get('/', taskController.getAllTasks);
router.get('/self', authenticateUser, taskController.getUserTasks);
router.post('/', authenticateUser, taskController.createTask);
router.put('/:id', authenticateUser, taskController.updateTask);
router.delete('/:id', authenticateUser, taskController.deleteTask);

module.exports = router;
