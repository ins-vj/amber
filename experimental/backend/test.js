import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

// Create a new pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false, // Allows self-signed SSL certificates
    },
});

// Function to test connection
const testConnection = async () => {
    const client = await pool.connect(); // Get a client from the pool
    try {
        console.log('Test: Connected to the database');
        const res = await client.query('SELECT NOW()');
        console.log('Current time:', res.rows[0]);
    } catch (err) {
        console.error('Test Connection error', err.stack);
    } finally {
        client.release(); // Release the client back to the pool
    }
};

testConnection();

// Function to save video URL
export const saveVideoUrl = async (videoUrl) => {
    const client = await pool.connect(); // Get a client from the pool
    try {
        const query = 'INSERT INTO videos (url) VALUES ($1)'; // Use parameterized query
        await client.query(query, [videoUrl]); // Pass videoUrl as a parameter
        console.log('Video URL saved:', videoUrl);
    } catch (error) {
        console.error('Error saving video URL:', error);
        throw error;
    } finally {
        client.release(); // Release the client back to the pool
    }
};

// Export the pool if you need to use it elsewhere
export default pool;
