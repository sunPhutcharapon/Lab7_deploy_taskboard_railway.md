// src/services/taskService.js
// Business Logic Layer

const taskRepository = require('../repositories/taskRepository');
const Task = require('../models/Task');

class TaskService {
    
    // Get all tasks
    async getAllTasks() {
        return await taskRepository.findAll();
    }

    // Get task by ID
    async getTaskById(id) {
        const task = await taskRepository.findById(id);
        if (!task) {
            const error = new Error('Task not found');
            error.statusCode = 404;
            throw error;
        }
        return task;
    }

    // Create new task
    async createTask(taskData) {
        // Validate
        const validation = Task.validate(taskData);
        if (!validation.isValid) {
            const error = new Error(validation.errors.join(', '));
            error.statusCode = 400;
            throw error;
        }

        return await taskRepository.create(taskData);
    }

    // Update task
    async updateTask(id, taskData) {
        // Check if task exists
        const existingTask = await taskRepository.findById(id);
        if (!existingTask) {
            const error = new Error('Task not found');
            error.statusCode = 404;
            throw error;
        }

        // Business rule: Cannot change status back from DONE
        if (existingTask.status === 'DONE' && taskData.status && taskData.status !== 'DONE') {
            const error = new Error('Cannot change status of completed task');
            error.statusCode = 400;
            throw error;
        }

        // Validate if provided
        if (taskData.title || taskData.status || taskData.priority) {
            const validation = Task.validate({
                ...existingTask,
                ...taskData
            });
            if (!validation.isValid) {
                const error = new Error(validation.errors.join(', '));
                error.statusCode = 400;
                throw error;
            }
        }

        return await taskRepository.update(id, taskData);
    }

    // Delete task
    async deleteTask(id) {
        // Check if task exists
        const existingTask = await taskRepository.findById(id);
        if (!existingTask) {
            const error = new Error('Task not found');
            error.statusCode = 404;
            throw error;
        }

        // Business rule: Cannot delete IN_PROGRESS tasks
        if (existingTask.status === 'IN_PROGRESS') {
            const error = new Error('Cannot delete task that is in progress');
            error.statusCode = 400;
            throw error;
        }

        return await taskRepository.delete(id);
    }

    // Get statistics
    async getStatistics() {
        const counts = await taskRepository.countByStatus();
        const total = counts.TODO + counts.IN_PROGRESS + counts.DONE;
        
        return {
            total,
            byStatus: counts,
            completionRate: total > 0 ? Math.round((counts.DONE / total) * 100) : 0
        };
    }
}

module.exports = new TaskService();
