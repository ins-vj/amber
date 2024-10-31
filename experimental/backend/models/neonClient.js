import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // This line is important for Neon
    }
});

client.connect()
    .then(() => console.log('Connected to the database'))
    .catch(err => console.error('Connection error', err.stack));

export const saveVideoUrl = async (videoUrl) => {
    try {
        const query = 'INSERT INTO videos (url) VALUES ($1)';
        await client.query(query, [videoUrl]);
    } catch (error) {
        console.error('Error saving video URL:', error);
        throw error;
    }
};

export default client;
