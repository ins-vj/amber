import pkg from 'pg';
const { Client } = pkg;import dotenv from 'dotenv';



// Configure the client with SSL support
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false, // Allows self-signed SSL certificates (common for cloud databases like Neon)
    },
});

// Connect to the database
const connectDatabase = async () => {
    try {
        await client.connect();
        console.log('Connected to the database');
    } catch (err) {
        console.error('Connection error', err.stack);
    }
};

connectDatabase(); // Call the connection function

// Function to save video URL
export const saveVideoUrl = async (videoUrl) => {
    try {
        const query = 'INSERT INTO videos (url) VALUES ($1)';
        await client.query(query, [videoUrl]);
        console.log('Video URL saved:', videoUrl);
    } catch (error) {
        console.error('Error saving video URL:', error);
        throw error;
    }
};

// Export the client if you need to use it elsewhere
export default client;
