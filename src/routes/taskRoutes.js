const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { authenticateUser } = require('../middlewares/authentication');

router.get('/', taskController.getAllTasks);
router.post('/', authenticateUser, taskController.createTask);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;
