// src/config/database.js
// PostgreSQL Database Connection for Docker Environment

const { Pool } = require('pg');

// สร้าง connection pool
// ใน Docker ใช้ชื่อ container แทน localhost
// Railway ใช้ DATABASE_URL, Docker ใช้ตัวแปรแยก
const pool = process.env.DATABASE_URL 
    ? new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
      })
    : new Pool({
        host: process.env.DB_HOST || 'db',
        port: parseInt(process.env.DB_PORT) || 5432,
        database: process.env.DB_NAME || 'taskboard_db',
        user: process.env.DB_USER || 'taskboard',
        password: process.env.DB_PASSWORD || 'taskboard123',
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000
      });

// Connection events
pool.on('connect', () => {
    console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
    console.error('❌ PostgreSQL pool error:', err.message);
});

// Query helper
const query = async (text, params) => {
    const start = Date.now();
    try {
        const result = await pool.query(text, params);
        const duration = Date.now() - start;
        console.log(`📊 Query: ${duration}ms | Rows: ${result.rowCount}`);
        return result;
    } catch (error) {
        console.error('❌ Query error:', error.message);
        throw error;
    }
};

// Health check
const healthCheck = async () => {
    try {
        const result = await pool.query('SELECT NOW() as time, current_database() as database');
        return {
            status: 'healthy',
            database: result.rows[0].database,
            timestamp: result.rows[0].time,
            poolSize: pool.totalCount,
            idleCount: pool.idleCount
        };
    } catch (error) {
        return {
            status: 'unhealthy',
            error: error.message
        };
    }
};

module.exports = { pool, query, healthCheck };
