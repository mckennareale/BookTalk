const db = require('../db');

// GET / setup_temp_tables
async function setupTempTables(req, res) {
    // const uid = '15'; // Assuming the user's id is '15' for demonstration
    const uid = req.userId;
    console.log(uid)

    if (!uid) {
        return res.status(401).json({ message: 'Unauthorized user' });
    }

    try {
        // get longitude, latitude and date_of_birth from app_users for the specific user
        const userDataQuery = await db.query(`
            SELECT 
                c.longitude, 
                c.latitude, 
                u.date_of_birth
            FROM app_users u JOIN cities c ON u.location_id = c.setting_id
            WHERE u.id = $1;
        `, [uid]);
        if (userDataQuery.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { longitude, latitude, date_of_birth: dob } = userDataQuery.rows[0];

        // Calculate user age
        const birthDate = new Date(dob);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        // Create temporary table for similar users
        await db.query(`
            CREATE TEMP TABLE IF NOT EXISTS temp_similar_users AS
            SELECT bx_users.id AS user_id
            FROM bx_users
            JOIN cities AS bx_city ON bx_users.location_id = bx_city.setting_id
            WHERE bx_users.age BETWEEN ($1 - 5) AND ($1 + 5)
                AND bx_city.latitude BETWEEN ($2::numeric(10,7) - 5) AND ($2::numeric(10,7) + 5)
                AND bx_city.longitude BETWEEN ($3::numeric(10,7) - 5) AND ($3::numeric(10,7) + 5);
        `, [age, latitude, longitude]);

        // Create index on the temporary table for similar users
        await db.query(`
            CREATE INDEX IF NOT EXISTS idx_temp_similar_users_user_id ON temp_similar_users (user_id);
        `);

        // Precompute similar categories
        await db.query(`
            CREATE TEMP TABLE IF NOT EXISTS temp_similar_categories AS
            SELECT bx_books.Category, COUNT(*) AS category_count
            FROM bx_books
            JOIN bx_reviews ON bx_books.isbn = bx_reviews.isbn
            WHERE bx_reviews.user_id IN (SELECT user_id FROM temp_similar_users)
                AND bx_reviews.rating > 7
                AND bx_books.Category IS NOT NULL
            GROUP BY bx_books.Category
            ORDER BY category_count DESC
            LIMIT 10;
        `);

        // Create index on the temporary table for similar categories
        await db.query(`
            CREATE INDEX IF NOT EXISTS idx_temp_similar_categories ON temp_similar_categories (Category);
        `);

        // Precompute similar authors
        await db.query(`
            CREATE TEMP TABLE IF NOT EXISTS temp_similar_authors AS
            SELECT bx_books.author, COUNT(*) AS author_count
            FROM bx_books
            JOIN bx_reviews ON bx_books.isbn = bx_reviews.isbn
            WHERE bx_reviews.user_id IN (SELECT user_id FROM temp_similar_users)
                AND bx_reviews.rating > 7
                AND bx_books.author IS NOT NULL
            GROUP BY bx_books.author
            ORDER BY author_count DESC
            LIMIT 10;
        `);

        // Create index on the temporary table for similar authors
        await db.query(`
            CREATE INDEX IF NOT EXISTS idx_temp_similar_authors ON temp_similar_authors (author);
        `);

        // Precompute similar user top books
        await db.query(`
            CREATE TEMP TABLE IF NOT EXISTS temp_similar_user_top_books AS
            SELECT
                b.title,
                b.categories,
                STRING_AGG(a.authors, ', ') AS all_authors,
                b.setting_id,
                AVG(r.review_score) AS avg_review_score
            FROM amazon_books b
            JOIN books_rating r ON b.id = r.book_id
            JOIN authors a ON b.id = a.id
            LEFT JOIN temp_similar_categories tsc ON LOWER(b.categories) = LOWER(tsc.Category)
            LEFT JOIN temp_similar_authors tsa ON LOWER(a.authors) = LOWER(tsa.author)
            WHERE
                b.setting_id IS NOT NULL
                AND b.categories IS NOT NULL
                AND (tsc.Category IS NOT NULL OR tsa.author IS NOT NULL)
            GROUP BY b.title, b.categories, b.setting_id;
        `);

        // Index on the temporary table for similar user top books
        await db.query(`
            CREATE INDEX IF NOT EXISTS idx_temp_similar_user_top_books_setting_id ON temp_similar_user_top_books (setting_id);
        `);

        // Return success response
        return res.status(200).json({ message: 'Temporary tables setup successfully.' });
    } catch (error) {
        console.error('Error setting up temporary tables:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    setupTempTables,
}