const db = require('../db');

// Route 14 - POST /users/books
async function addUserBooks(req, res) {
    const uid = req.userId;
    if (!uid) {
        console.log("missing uid");
        return res.status(401).json({ message: 'Unauthorized user' });
    }

    const book_ids = req.body.data.book_ids;
    const { review_score, summary, text } = req.body.data;

    if (!Array.isArray(book_ids) || book_ids.length === 0) {
        return res.status(400).json({ message: 'Missing or invalid book IDs list' });
    }

    try {
        for (const book_id of book_ids) {
            if (!uid || !book_id) {
                continue;
            }

            await db.query(
                `
                INSERT INTO has_reviewed (user_id, book_id, review_score, summary, text)
                VALUES ($1, $2, $3, $4, $5);
                `,
                [user_id, book_id, review_score, summary, text]
            );
        }
        return res.status(200).json({ message: 'User books successfully added' });
    } catch (e) {
        console.error('Error inserting user books:', e);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

// Route 15 - GET /users/books
// Get book(s) an app user read
async function getUserBooks(req, res) {
    // TO DO
    // More info may need to be added to the response
    // E.g., authors, categories read etc 
    // const uid = req.userId;
    // if (!uid) {
    //     return res.status(401).json({ message: 'Unauthorized user' });
    // }

    const uid = req.userId;
    if (!uid) {
        console.log("missing uid");
        return res.status(401).json({ message: 'Unauthorized user' });
    }

    try {
        const bookResult = await db.query(`
            SELECT DISTINCT ab.title, ab.authors, ab.image, ab.preview_link
            FROM amazon_books ab JOIN has_reviewed hr ON hr.book_id = ab.id
            JOIN app_users au ON hr.user_id = au.id
            WHERE au.id = $1;
            `, [uid]);
        
        if (bookResult.rows.length === 0) {
            return res.status(400).json({ message: `User ID not found for id ${uid}`});
        }
        
        const result = bookResult.rows.map(row => ({
            title: row.title,
            authors: row.authors,
            image: row.image,
            preview_link: row.preview_link
        }));

        return res.status(200).json(result);

    } catch(e) {
        console.error(`Error getting full info for book id ${bookId}: `, e);
        return res.status(500).json({ message: "Internal server error"});
    }
}

// Route 17 - POST /users/onboard
async function addUserOnboardInfo(req, res) {
    const uid = req.userId;
    if (!uid) {
        console.log("missing uid");
        return res.status(401).json({ message: 'Unauthorized user' });
    }

    const book_ids = req.body.data.book_ids;
    const city_id = req.body.data.city_id;
    const date_of_birth = req.body.data.date_of_birth;
    if (!Array.isArray(book_ids) || book_ids.length === 0) {
        return res.status(400).json({ message: 'Missing or invalid book IDs list' });
    }
    if (!city_id) {
        return res.status(400).json({ message: 'Missing city id' });
    }
    if (!date_of_birth) {
        return res.status(400).json({ message: 'Missing date of birth' });
    }

    try {

        const client = await db.connect();

        try {
            await client.query('BEGIN');

            for (const book_id of book_ids) {
                if (!book_id) { continue; }
                await db.query(
                    `INSERT INTO has_reviewed (user_id, book_id) 
                    VALUES ($1, $2)
                    ON CONFLICT (user_id, book_id) DO NOTHING;`,
                    [uid, book_id]
                );
            }

            await client.query(
                'UPDATE app_users SET date_of_birth = $1, location_id = $2 WHERE id = $3;',
                [date_of_birth, city_id, uid]
            );

            await client.query('COMMIT');

            return res.status(200).json({ message: 'User onboarding info successfully added' });
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
        
    } catch (e) {
        console.error('Error inserting user books:', e);
        return res.status(500).json({ message: 'Internal server error' });
    }
}


module.exports = {
    addUserBooks,
    getUserBooks,
    addUserOnboardInfo
}