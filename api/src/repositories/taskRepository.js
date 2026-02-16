// src/repositories/taskRepository.js
// Data Access Layer - PostgreSQL queries

const { query } = require('../config/database');
const Task = require('../models/Task');

class TaskRepository {
    
    // Get all tasks
    async findAll() {
        const sql = `
            SELECT id, title, description, status, priority, 
                   created_at, updated_at 
            FROM tasks 
            ORDER BY 
                CASE priority 
                    WHEN 'HIGH' THEN 1 
                    WHEN 'MEDIUM' THEN 2 
                    WHEN 'LOW' THEN 3 
                END,
                created_at DESC
        `;
        const result = await query(sql);
        return result.rows.map(row => new Task(row));
    }

    // Get task by ID
    async findById(id) {
        const sql = `
            SELECT id, title, description, status, priority, 
                   created_at, updated_at 
            FROM tasks 
            WHERE id = $1
        `;
        const result = await query(sql, [id]);
        if (result.rows.length === 0) return null;
        return new Task(result.rows[0]);
    }

    // Create new task
    async create(taskData) {
        const sql = `
            INSERT INTO tasks (title, description, status, priority)
            VALUES ($1, $2, $3, $4)
            RETURNING id, title, description, status, priority, 
                      created_at, updated_at
        `;
        const values = [
            taskData.title,
            taskData.description || '',
            taskData.status || 'TODO',
            taskData.priority || 'MEDIUM'
        ];
        const result = await query(sql, values);
        return new Task(result.rows[0]);
    }

    // Update task
    async update(id, taskData) {
        const sql = `
            UPDATE tasks 
            SET title = COALESCE($1, title),
                description = COALESCE($2, description),
                status = COALESCE($3, status),
                priority = COALESCE($4, priority),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $5
            RETURNING id, title, description, status, priority, 
                      created_at, updated_at
        `;
        const values = [
            taskData.title,
            taskData.description,
            taskData.status,
            taskData.priority,
            id
        ];
        const result = await query(sql, values);
        if (result.rows.length === 0) return null;
        return new Task(result.rows[0]);
    }

    // Delete task
    async delete(id) {
        const sql = 'DELETE FROM tasks WHERE id = $1 RETURNING id';
        const result = await query(sql, [id]);
        return result.rowCount > 0;
    }

    // Get tasks by status
    async findByStatus(status) {
        const sql = `
            SELECT id, title, description, status, priority, 
                   created_at, updated_at 
            FROM tasks 
            WHERE status = $1
            ORDER BY created_at DESC
        `;
        const result = await query(sql, [status]);
        return result.rows.map(row => new Task(row));
    }

    // Count tasks by status
    async countByStatus() {
        const sql = `
            SELECT status, COUNT(*) as count 
            FROM tasks 
            GROUP BY status
        `;
        const result = await query(sql);
        return result.rows.reduce((acc, row) => {
            acc[row.status] = parseInt(row.count);
            return acc;
        }, { TODO: 0, IN_PROGRESS: 0, DONE: 0 });
    }
}

module.exports = new TaskRepository();
