const db = require('../db');

// Route 1 - GET /books/full_info/:bookId
async function getBookFullInfo(req, res) {
    // const uid = req.userId;
    // if (!uid) {
    //     return res.status(401).json({ message: 'Unauthorized user' });
    // }

    // console.log("new");

    const bookId = req.params.bookId;
    if (!bookId) {
        return res.status(400).json({message: 'Missing book id'});
    }

    try {
        const bookResult = await db.query(`
            SELECT ab.title, ab.description, ab.image, ab.publisher, ab.published_date,
                ab.categories, AVG(ar.price) AS avg_price, 
                ROUND(AVG(ar.review_score),2) AS avg_rating,
                ab.film_name, ab.classification
            FROM amazon_books ab
                LEFT JOIN books_rating ar ON ab.id = ar.book_id
            WHERE ab.id = $1
            GROUP BY ab.title, ab.description, ab.image, ab.publisher, ab.published_date,
                ab.categories,ab.film_name, ab.classification;
            `, [bookId]);
        
        if (bookResult.rows.length === 0) {
            return res.status(400).json({ message: `Book not found for book id ${bookId}`});
        }

        const authorsResult = await db.query(`
            SELECT authors
            FROM authors
            WHERE id = $1
            `, [bookId]);

        const reviewsResult = await db.query(`
            SELECT review_summary
            FROM books_rating
            WHERE book_id = $1;
            `, [bookId]);

        const reviews = reviewsResult.rows
            .filter(r => r.review_summary)
            .map(r => r.review_summary);
        const authors = authorsResult.rows
            .filter(r => r.authors)
            .map(r => r.authors);
        
        const result = {
            title: bookResult.rows[0].title,
            description: bookResult.rows[0].description,
            image: bookResult.rows[0].image,
            authors: authors,
            publisher: bookResult.rows[0].publisher,
            published_date: bookResult.rows[0].published_date,
            category: bookResult.rows[0].categories,
            avg_rating: bookResult.rows[0].avg_rating,
            film_name: bookResult.rows[0].film_name,
            avg_price: bookResult.rows[0].avg_price,
            reviews: reviews.length > 3 ? reviews.slice(0,3) : reviews,
            classification: bookResult.rows[0].classification,
        };

        return res.status(200).json(result);

    } catch(e) {
        console.error(`Error getting full info for book id ${bookId}: `, e);
        return res.status(500).json({ message: "Internal server error"});
    }
    
}


// Route 2 - POST /books/books/partialInfo
async function getBooksPartialInfo(req, res) {

}


// Route 3 - GET /books/search
async function searchBooks(req, res) {
    
}



module.exports = {
    getBookFullInfo,
    getBooksPartialInfo,
    searchBooks,

}