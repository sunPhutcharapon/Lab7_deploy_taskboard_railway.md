-- ============================================
-- Database Initialization Script
-- ENGSE207 - Week 6 Docker Version
-- ============================================

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT DEFAULT '',
    status VARCHAR(20) DEFAULT 'TODO' CHECK (status IN ('TODO', 'IN_PROGRESS', 'DONE')),
    priority VARCHAR(20) DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);

-- Create function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_update_timestamp ON tasks;
CREATE TRIGGER trigger_update_timestamp
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Insert sample data
INSERT INTO tasks (title, description, status, priority) VALUES
    ('Setup Docker Environment', 'Install Docker and Docker Compose', 'DONE', 'HIGH'),
    ('Create Dockerfile', 'Write Dockerfile for API container', 'DONE', 'HIGH'),
    ('Configure PostgreSQL', 'Setup database container with init script', 'DONE', 'HIGH'),
    ('Setup Nginx', 'Configure reverse proxy and SSL', 'IN_PROGRESS', 'HIGH'),
    ('Create Docker Compose', 'Orchestrate all containers', 'IN_PROGRESS', 'MEDIUM'),
    ('Test API Endpoints', 'Verify all CRUD operations work', 'TODO', 'MEDIUM'),
    ('Write Documentation', 'Complete ANALYSIS.md', 'TODO', 'LOW'),
    ('Push to Git', 'Commit and push to repository', 'TODO', 'MEDIUM');

-- Verify data
SELECT 'Database initialized successfully!' as message;
SELECT COUNT(*) as total_tasks FROM tasks;
SELECT status, COUNT(*) as count FROM tasks GROUP BY status;
