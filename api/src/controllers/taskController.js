// src/controllers/taskController.js
// Presentation Layer - Handle HTTP requests

const taskService = require('../services/taskService');

class TaskController {
    
    // GET /api/tasks
    async getAllTasks(req, res, next) {
        try {
            const tasks = await taskService.getAllTasks();
            res.json({
                success: true,
                count: tasks.length,
                data: tasks
            });
        } catch (error) {
            next(error);
        }
    }

    // GET /api/tasks/:id
    async getTaskById(req, res, next) {
        try {
            const task = await taskService.getTaskById(req.params.id);
            res.json({
                success: true,
                data: task
            });
        } catch (error) {
            next(error);
        }
    }

    // POST /api/tasks
    async createTask(req, res, next) {
        try {
            const task = await taskService.createTask(req.body);
            res.status(201).json({
                success: true,
                message: 'Task created successfully',
                data: task
            });
        } catch (error) {
            next(error);
        }
    }

    // PUT /api/tasks/:id
    async updateTask(req, res, next) {
        try {
            const task = await taskService.updateTask(req.params.id, req.body);
            res.json({
                success: true,
                message: 'Task updated successfully',
                data: task
            });
        } catch (error) {
            next(error);
        }
    }

    // DELETE /api/tasks/:id
    async deleteTask(req, res, next) {
        try {
            await taskService.deleteTask(req.params.id);
            res.json({
                success: true,
                message: 'Task deleted successfully'
            });
        } catch (error) {
            next(error);
        }
    }

    // GET /api/tasks/stats
    async getStatistics(req, res, next) {
        try {
            const stats = await taskService.getStatistics();
            res.json({
                success: true,
                data: stats
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new TaskController();
