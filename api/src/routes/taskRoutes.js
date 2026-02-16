// src/routes/taskRoutes.js
// API Route definitions

const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// GET /api/tasks/stats - Statistics (ต้องอยู่ก่อน /:id)
router.get('/stats', taskController.getStatistics.bind(taskController));

// GET /api/tasks - Get all tasks
router.get('/', taskController.getAllTasks.bind(taskController));

// GET /api/tasks/:id - Get single task
router.get('/:id', taskController.getTaskById.bind(taskController));

// POST /api/tasks - Create task
router.post('/', taskController.createTask.bind(taskController));

// PUT /api/tasks/:id - Update task
router.put('/:id', taskController.updateTask.bind(taskController));

// DELETE /api/tasks/:id - Delete task
router.delete('/:id', taskController.deleteTask.bind(taskController));

module.exports = router;
