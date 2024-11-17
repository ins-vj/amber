import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Save course details and return courseId
export const saveCourseDetails = async (courseDetails) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        const courseQuery = `
            INSERT INTO courses (
                name, description, image_url, promo_video_url,
                category, sub_category, prerequisites, price
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id
        `;
        
        const courseValues = [
            courseDetails.name,
            courseDetails.description,
            courseDetails.imageUrl,
            courseDetails.promoVideoUrl,
            courseDetails.category,
            courseDetails.subCategory,
            courseDetails.prerequisites,
            courseDetails.price
        ];

        const result = await client.query(courseQuery, courseValues);
        await client.query('COMMIT');
        return result.rows[0].id;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

// Save course structure (chapters and subtopics)
export const saveCourseStructure = async (courseId, chapters) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        for (const chapter of chapters) {
            // Insert chapter
            const chapterQuery = `
                INSERT INTO chapters (course_id, chapter_id, name)
                VALUES ($1, $2, $3)
            `;
            await client.query(chapterQuery, [courseId, chapter.id, chapter.name]);
            
            // Insert subtopics for this chapter
            for (const subtopic of chapter.subtopics) {
                const subtopicQuery = `
                    INSERT INTO subtopics (
                        course_id, chapter_id, subtopic_id,
                        name, video_description
                    ) VALUES ($1, $2, $3, $4, $5)
                `;
                await client.query(subtopicQuery, [
                    courseId,
                    chapter.id,
                    subtopic.id,
                    subtopic.name,
                    subtopic.videoDescription
                ]);
            }
        }
        
        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

// Save video URL and related details
export const saveVideoUrl = async (videoDetails) => {
    const client = await pool.connect();
    try {
        const query = `
            INSERT INTO videos (
                url, public_id, course_id, course_name,
                chapter_id, subtopic_id, folder_path,
                duration, format, resource_type, is_promo
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        `;
        
        const values = [
            videoDetails.videoUrl,
            videoDetails.publicId,
            videoDetails.courseId,
            videoDetails.courseName,
            videoDetails.chapterId,
            videoDetails.subtopicId,
            videoDetails.folderPath,
            videoDetails.duration,
            videoDetails.format,
            videoDetails.resourceType,
            videoDetails.isPromo || false
        ];

        await client.query(query, values);
    } catch (error) {
        throw error;
    } finally {
        client.release();
    }
};