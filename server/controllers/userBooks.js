const db = require('../db');
// INSERT INTO has_reviewed (user_id, book_id, review_score, summary, text)
// VALUES ($1, $2, $3, $4, $5);

// Route 14 - POST /users/books
async function addUserBooks(req, res) {
    const user_id = '15';
    const book_ids = req.body.data.book_ids;
    const { review_score, summary, text } = req.body.data;

    if (!user_id) {
        return res.status(400).json({ message: 'Missing or invalid user ID' });
    }
    if (!Array.isArray(book_ids) || book_ids.length === 0) {
        return res.status(400).json({ message: 'Missing or invalid book IDs list' });
    }

    try {
        for (const book_id of book_ids) {
            if (!user_id || !book_id) {
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

    // console.log("new");
    const user_id = '15';
    // const user_id = req.body.data.user_id;
    if (!user_id) {
        return res.status(400).json({message: 'Missing user id'});
    }

    try {
        const bookResult = await db.query(`
            SELECT DISTINCT ab.title, ab.authors, ab.image, ab.preview_link
            FROM amazon_books ab JOIN has_reviewed hr ON hr.book_id = ab.id
            JOIN app_users au ON hr.user_id = au.id
            WHERE au.id = $1;
            `, [user_id]);
        
        if (bookResult.rows.length === 0) {
            return res.status(400).json({ message: `User ID not found for id ${user_id}`});
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



module.exports = {
    addUserBooks,
    getUserBooks
}