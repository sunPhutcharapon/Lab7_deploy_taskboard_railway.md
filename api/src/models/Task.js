// src/models/Task.js
// Task Model - Data structure definition

class Task {
    constructor(data) {
        this.id = data.id;
        this.title = data.title;
        this.description = data.description || '';
        this.status = data.status || 'TODO';
        this.priority = data.priority || 'MEDIUM';
        this.createdAt = data.created_at || data.createdAt;
        this.updatedAt = data.updated_at || data.updatedAt;
    }

    // Valid statuses
    static STATUSES = ['TODO', 'IN_PROGRESS', 'DONE'];
    
    // Valid priorities
    static PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'];

    // Validate task data
    static validate(data) {
        const errors = [];

        if (!data.title || data.title.trim().length === 0) {
            errors.push('Title is required');
        }
        if (data.title && data.title.length > 200) {
            errors.push('Title must be less than 200 characters');
        }
        if (data.status && !Task.STATUSES.includes(data.status)) {
            errors.push(`Status must be one of: ${Task.STATUSES.join(', ')}`);
        }
        if (data.priority && !Task.PRIORITIES.includes(data.priority)) {
            errors.push(`Priority must be one of: ${Task.PRIORITIES.join(', ')}`);
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    // Convert to JSON
    toJSON() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            status: this.status,
            priority: this.priority,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}

module.exports = Task;
