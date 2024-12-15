const db = require('../db');

// GET / setup_temp_tables
// async function setupTempTables(req, res) {
//     // const uid = '15'; // Assuming the user's id is '15' for demonstration
//     const uid = req.userId;
//     console.log(uid)

//     if (!uid) {
//         return res.status(401).json({ message: 'Unauthorized user' });
//     }

//     try {
//         // get longitude, latitude and date_of_birth from app_users for the specific user
//         const userDataQuery = await db.query(`
//             SELECT 
//                 c.longitude, 
//                 c.latitude, 
//                 u.date_of_birth
//             FROM app_users u JOIN cities c ON u.location_id = c.setting_id
//             WHERE u.id = $1;
//         `, [uid]);
//         if (userDataQuery.rows.length === 0) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         const { longitude, latitude, date_of_birth: dob } = userDataQuery.rows[0];

//         // Calculate user age
//         const birthDate = new Date(dob);
//         const today = new Date();
//         const age = today.getFullYear() - birthDate.getFullYear();
//         const m = today.getMonth() - birthDate.getMonth();
//         if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
//             age--;
//         }

//         // Create a materialized view for this user with these details on lat long age
        
//         // Return success response
//         return res.status(200).json({ message: 'view setup successfully.' });
//     } catch (error) {
//         console.error('Error setting up temporary tables:', error);
//         return res.status(500).json({ message: 'Internal server error' });
//     }
// }

async function setupMaterializedView(req, res) {
    const uid = req.userId;
    const sanitizedUid = uid.replace(/-/g, '_');

    if (!uid) {
        return res.status(401).json({ message: 'Unauthorized user' });
    }

    const client = await db.connect();
    try {
        // Define materialized view name specific to the user
        // const viewName = `user_${uid}_materialized_view`;
        const viewName = `user_${sanitizedUid}_location_view`;

        // Check if the materialized view already exists
        const viewCheck = await client.query(`
            SELECT 1 
            FROM pg_matviews 
            WHERE matviewname = $1;
        `, [viewName]);

        if (viewCheck.rows.length > 0) {
            // Materialized view already exists, no need to recreate it
            return res.status(200).json({ message: 'Materialized view already exists.', viewName });
        }

        // Fetch user's data (longitude, latitude, and date_of_birth)
        const userDataQuery = await client.query(`
            SELECT 
                c.longitude, 
                c.latitude, 
                u.date_of_birth
            FROM app_users u 
            JOIN cities c ON u.location_id = c.setting_id
            WHERE u.id = $1;
        `, [uid]);

        if (userDataQuery.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { longitude, latitude, date_of_birth: dob } = userDataQuery.rows[0];

        // Use dummy latitude and longitude if location details are missing
        if (!longitude || !latitude) {
            console.warn(`User ${uid} is missing location details. Using dummy values.`);
            longitude = -122.4194; // Example: San Francisco longitude
            latitude = 37.7749; // Example: San Francisco latitude
        }

        // Calculate user's age
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        console.log("age",age)
        console.log("lat",latitude)
        console.log("long",longitude)
        console.log('Creating materialized view with name:', viewName);
        // Create the materialized view if it doesn't already exist
        const createViewQuery = `
        CREATE MATERIALIZED VIEW ${viewName} AS
        WITH temp_similar_users AS (
            SELECT bx_users.id AS user_id
            FROM bx_users
            JOIN cities AS bx_city ON bx_users.location_id = bx_city.setting_id
            WHERE bx_users.age BETWEEN (${age} - 5) AND (${age} + 5)
              AND bx_city.latitude BETWEEN (${latitude} - 30) AND (${latitude} + 30)
              AND bx_city.longitude BETWEEN (${longitude} - 30) AND (${longitude} + 30)
        ),
        temp_similar_categories AS (
            SELECT bx_books.Category, COUNT(*) AS category_count
            FROM bx_books
            JOIN bx_reviews ON bx_books.isbn = bx_reviews.isbn
            WHERE bx_reviews.user_id IN (SELECT user_id FROM temp_similar_users)
              AND bx_reviews.rating > 7
              AND bx_books.Category IS NOT NULL
            GROUP BY bx_books.Category
            ORDER BY category_count DESC
            LIMIT 10
        ),
        temp_similar_authors AS (
            SELECT bx_books.author, COUNT(*) AS author_count
            FROM bx_books
            JOIN bx_reviews ON bx_books.isbn = bx_reviews.isbn
            WHERE bx_reviews.user_id IN (SELECT user_id FROM temp_similar_users)
              AND bx_reviews.rating > 7
              AND bx_books.author IS NOT NULL
            GROUP BY bx_books.author
            ORDER BY author_count DESC
            LIMIT 10
        ),
        temp_similar_user_top_books AS (
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
            GROUP BY b.title, b.categories, b.setting_id
        )
        SELECT * FROM temp_similar_user_top_books; 
        `;

        // Execute the dynamically built query
        await client.query(createViewQuery);


        const checkView = await client.query(`
            SELECT * 
            FROM pg_matviews 
            WHERE matviewname = $1;
        `, [viewName]);
        
        console.log('View Check Result:', checkView.rows);

        // Return success response
        return res.status(200).json({ message: 'Materialized view created successfully.', viewName });
    } catch (error) {
        console.error('Error setting up materialized view:', error);
        return res.status(500).json({ message: 'Internal server error' });
    } finally {
        client.release();
    }
}

module.exports = {
    // setupTempTables,
    setupMaterializedView
}