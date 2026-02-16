// ============================================
// Task Board Frontend Application
// ENGSE207 - Week 6 Docker Version
// ============================================

const API_BASE = 'https://engse207-task-board-production.up.railway.app/api';

// ============================================
// API Functions
// ============================================

async function fetchAPI(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
            },
            ...options
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error?.message || 'API Error');
        }
        
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Get all tasks
async function getTasks() {
    const response = await fetchAPI('/tasks');
    return response.data;
}

// Create task
async function createTask(taskData) {
    const response = await fetchAPI('/tasks', {
        method: 'POST',
        body: JSON.stringify(taskData)
    });
    return response.data;
}

// Update task
async function updateTask(id, taskData) {
    const response = await fetchAPI(`/tasks/${id}`, {
        method: 'PUT',
        body: JSON.stringify(taskData)
    });
    return response.data;
}

// Delete task
async function deleteTask(id) {
    await fetchAPI(`/tasks/${id}`, {
        method: 'DELETE'
    });
}

// Get statistics
async function getStats() {
    const response = await fetchAPI('/tasks/stats');
    return response.data;
}

// ============================================
// UI Functions
// ============================================

function createTaskCard(task) {
    const card = document.createElement('div');
    card.className = `task-card priority-${task.priority.toLowerCase()}`;
    card.dataset.id = task.id;
    
    const statusEmoji = {
        'TODO': '📝',
        'IN_PROGRESS': '🔄',
        'DONE': '✅'
    };
    
    const priorityEmoji = {
        'LOW': '🟢',
        'MEDIUM': '🟡',
        'HIGH': '🔴'
    };
    
    card.innerHTML = `
        <div class="task-title">${escapeHtml(task.title)}</div>
        ${task.description ? `<div class="task-description">${escapeHtml(task.description)}</div>` : ''}
        <div class="task-meta">
            <span>${priorityEmoji[task.priority]} ${task.priority}</span>
            <div class="task-actions">
                ${task.status !== 'DONE' ? `
                    <button class="btn-status" onclick="moveTask(${task.id}, '${getNextStatus(task.status)}')">
                        Move →
                    </button>
                ` : ''}
                ${task.status !== 'IN_PROGRESS' ? `
                    <button class="btn-delete" onclick="removeTask(${task.id})">
                        Delete
                    </button>
                ` : ''}
            </div>
        </div>
    `;
    
    return card;
}

function getNextStatus(currentStatus) {
    const flow = {
        'TODO': 'IN_PROGRESS',
        'IN_PROGRESS': 'DONE',
        'DONE': 'DONE'
    };
    return flow[currentStatus];
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

async function renderTasks() {
    const todoList = document.getElementById('todo-list');
    const progressList = document.getElementById('progress-list');
    const doneList = document.getElementById('done-list');
    
    todoList.innerHTML = '<div class="loading">Loading...</div>';
    progressList.innerHTML = '<div class="loading">Loading...</div>';
    doneList.innerHTML = '<div class="loading">Loading...</div>';
    
    try {
        const tasks = await getTasks();
        
        todoList.innerHTML = '';
        progressList.innerHTML = '';
        doneList.innerHTML = '';
        
        tasks.forEach(task => {
            const card = createTaskCard(task);
            
            switch (task.status) {
                case 'TODO':
                    todoList.appendChild(card);
                    break;
                case 'IN_PROGRESS':
                    progressList.appendChild(card);
                    break;
                case 'DONE':
                    doneList.appendChild(card);
                    break;
            }
        });
        
        if (todoList.children.length === 0) {
            todoList.innerHTML = '<div class="loading">No tasks</div>';
        }
        if (progressList.children.length === 0) {
            progressList.innerHTML = '<div class="loading">No tasks</div>';
        }
        if (doneList.children.length === 0) {
            doneList.innerHTML = '<div class="loading">No tasks</div>';
        }
        
    } catch (error) {
        console.error('Error loading tasks:', error);
        todoList.innerHTML = '<div class="error-message">Failed to load tasks</div>';
    }
}

async function renderStats() {
    const statsDiv = document.getElementById('stats');
    
    try {
        const stats = await getStats();
        
        statsDiv.innerHTML = `
            <span class="stat-item">📊 Total: ${stats.total}</span>
            <span class="stat-item">📝 TODO: ${stats.byStatus.TODO}</span>
            <span class="stat-item">🔄 In Progress: ${stats.byStatus.IN_PROGRESS}</span>
            <span class="stat-item">✅ Done: ${stats.byStatus.DONE}</span>
            <span class="stat-item">📈 Completion: ${stats.completionRate}%</span>
        `;
    } catch (error) {
        console.error('Error loading stats:', error);
        statsDiv.innerHTML = '<span class="stat-item">❌ Failed to load stats</span>';
    }
}

// ============================================
// Event Handlers
// ============================================

async function moveTask(id, newStatus) {
    try {
        await updateTask(id, { status: newStatus });
        await renderTasks();
        await renderStats();
    } catch (error) {
        alert('Error moving task: ' + error.message);
    }
}

async function removeTask(id) {
    if (!confirm('Are you sure you want to delete this task?')) {
        return;
    }
    
    try {
        await deleteTask(id);
        await renderTasks();
        await renderStats();
    } catch (error) {
        alert('Error deleting task: ' + error.message);
    }
}

// Form submit
document.getElementById('taskForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        title: document.getElementById('title').value.trim(),
        description: document.getElementById('description').value.trim(),
        status: document.getElementById('status').value,
        priority: document.getElementById('priority').value
    };
    
    try {
        await createTask(formData);
        e.target.reset();
        await renderTasks();
        await renderStats();
    } catch (error) {
        alert('Error creating task: ' + error.message);
    }
});

// ============================================
// Initialize
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🐳 Task Board - Docker Version Initialized');
    renderTasks();
    renderStats();
    
    // Auto refresh every 30 seconds
    setInterval(() => {
        renderTasks();
        renderStats();
    }, 30000);
});
