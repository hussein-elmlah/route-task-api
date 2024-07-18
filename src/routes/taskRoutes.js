const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { authenticateUser } = require('../middlewares/authentication');
const { taskAuthorization } = require('../middlewares/authorization');

router.get('/', taskController.getAllTasks);
router.get('/self', authenticateUser, taskController.getUserTasks);
router.post('/', authenticateUser, taskController.createTask);
router.put('/:id', authenticateUser, taskAuthorization, taskController.updateTask);
router.delete('/:id', authenticateUser, taskAuthorization, taskController.deleteTask);

module.exports = router;
