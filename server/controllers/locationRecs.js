const db = require('../db');

// Route 9 - GET /books/set_in_location_recs
// 
async function getLocationRecs(req, res) {

    // get user id
    const uid = req.userId;
    if (!uid) {
        return res.status(401).json({ message: 'Unauthorized user' });
    }

    try {
        // get longitude, latitude and date_of_birth from app_users for the specific user
        const userDataQuery = await query(`
            SELECT 
                c.longitude, 
                c.latitude, 
                u.date_of_birth
            FROM app_users u INNER JOIN cities c ON u.location_id = c.id
            WHERE u.uid = $1;
        `, [uid]);
    
        if (userDataQuery.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
    
        const { longitude, latitude, date_of_birth: dob } = userDataQuery.rows[0];
        console.log(`Longitude: ${longitude}, Latitude: ${latitude}, Date of Birth: ${dob}`);
        
        // get userAge 
        const birthDate = new Date(dob);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        console.log(`User Age: ${age}`);

        const locationRecsResult = await db.query(`
            WITH similar_users AS (
                SELECT bx_users.id AS user_id
                FROM bx_users
                JOIN cities AS bx_city ON bx_users.location_id = bx_city.setting_id
                WHERE bx_users.age BETWEEN ($1 - 5) AND ($1 + 5)
                    AND bx_city.latitude BETWEEN ($2 - 5) AND ($2 + 5)
                    AND bx_city.longitude BETWEEN ($3 - 5) AND ($3 + 5)
            ),
            similar_categories AS (
                SELECT bx_books.Category, COUNT(*) AS category_count
                FROM bx_books
                JOIN bx_reviews ON bx_books.isbn = bx_reviews.isbn
                WHERE bx_reviews.user_id IN (SELECT user_id FROM similar_users)
                    AND bx_reviews.rating > 7
                    AND bx_books.Category IS NOT NULL
                GROUP BY bx_books.Category
                ORDER BY category_count DESC
                LIMIT 10
            ),
            similar_authors AS (
                SELECT bx_books.author, COUNT(*) AS author_count
                FROM bx_books
                JOIN bx_reviews ON bx_books.isbn = bx_reviews.isbn
                WHERE bx_reviews.user_id IN (SELECT user_id FROM similar_users)
                    AND bx_reviews.rating > 7
                    AND bx_books.author IS NOT NULL
                GROUP BY bx_books.author
                ORDER BY author_count DESC
                LIMIT 10
            ),
            similar_user_top_books AS (
                SELECT DISTINCT b.title, b.categories, STRING_AGG(a.authors, ', ') AS all_authors, b.setting_id, AVG(r.review_score) AS avg_review_score
                FROM amazon_books b
                JOIN books_rating r ON b.id = r.book_id 
                JOIN authors a ON b.id = a.id
                WHERE
                    (LOWER(b.categories) IN (SELECT Category FROM similar_categories)
                    OR EXISTS (
                        SELECT 1
                        FROM authors a1
                        WHERE a1.id = b.id AND LOWER(a1.authors) IN (SELECT LOWER(author) FROM similar_authors)
                    ))
                    AND b.setting_id IS NOT NULL 
                    AND b.categories IS NOT NULL
                GROUP BY b.title, b.categories, b.setting_id
                ORDER BY avg_review_score DESC
                LIMIT 500
            )
            SELECT c.setting_id, c.city, c.country_name, c.latitude, c.longitude, COUNT(*) AS num_books_set_in
            FROM cities c
            JOIN similar_user_top_books b ON c.city = b.setting_id
            GROUP BY c.setting_id, c.city, c.country_name, c.latitude, c.longitude
            ORDER BY num_books_set_in DESC
            LIMIT 5;
        `, [age, latitude, longitude]);
        
        // Check if there are any results
        if (locationRecsResult.rows.length === 0) {
            return res.status(400).json({ message: `No location recommendations found.` });
        }
        
        // Map the results correctly
        const result = locationRecsResult.rows.map(row => ({
            city: row.city,
            country: row.country_name,
            latitude: row.latitude,
            longitude: row.longitude
        }));
        
        // Return the result
        return res.status(200).json(result);
        

    } catch (error) {
        console.error('Error fetching user data:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
    
}


module.exports = {
    getLocationRecs,
}