const db = require('../db');

// TO DOS
// 1. Add bx book option for routes 2 & 3
// 2. Add time period 

// Route 1 - GET /books/full_info/:bookId
async function getBookFullInfo(req, res) {
    const uid = req.userId;
    if (!uid) {
        return res.status(401).json({ message: 'Unauthorized user' });
    }

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
            SELECT DISTINCT authors
            FROM authors
            WHERE id = $1
            `, [bookId]);

        const reviewsResult = await db.query(`
            SELECT review_summary,
                review_text,
                review_score,
                profile_name,
                review_helpfulness
            FROM books_rating
            WHERE book_id = $1
            LIMIT 6;
            `, [bookId]);

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
            category: (() => {
                let categories = bookResult.rows[0].categories;
                if (typeof categories === 'string') {
                    try {
                        categories = categories.replace(/'/g, '"');
                        categories = JSON.parse(categories); // Parse as JSON
                    } catch (e) {
                        console.error('Error parsing categories:', e);
                    }
                }
                if (Array.isArray(categories)) {
                    return categories.length === 1 ? categories[0] : categories.join(', ');
                }
                return categories || 'Unknown';
            })(),
            avg_rating: bookResult.rows[0].avg_rating,
            film_name: bookResult.rows[0].film_name,
            avg_price: bookResult.rows[0].avg_price,
            reviews: reviewsResult.rows,
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
    // const uid = req.userId;
    // if (!uid) {
    //     return res.status(401).json({ message: 'Unauthorized user' });
    // }
    const bookIds = req.body.data.book_ids;
    if (!Array.isArray(bookIds) || bookIds.length < 1) {
        return res.status(400).json("Input needes to be a non-empty array of book ids");
    }

    try {

        let cnt = 0;
        const validBooks = bookIds.filter(id => (typeof id === "string" && id.length <= 36));

        if (validBooks.length === 0) {
            return res.status(400).json("Input needes to be a non-empty array of valid book ids");
        }

        const queryStringList = validBooks
            .map(id => {
                cnt += 1;
                return `$${cnt}`
            });
        const queryString = queryStringList.join(',')

        const bookResults = await db.query(`
            SELECT DISTINCT ab.id, ab.title, ab.image, ab.classification,
                ab.categories, ROUND(AVG(ar.review_score),2) AS avg_rating
                FROM amazon_books ab
                    LEFT JOIN books_rating ar ON ab.id = ar.book_id
                WHERE ab.id IN (${queryString})
                GROUP BY ab.id, ab.title, ab.image, ab.classification, ab.categories;
        `, validBooks);

        const result = bookResults.rows
            .map((r) => ({
                isbn: r.id,
                title: r.title,
                image: r.image,
                classification: r.classification,
                category: r.categories,
                average_rating: r.avg_rating
            }));
        // console.log(result);
        
        return res.status(200).json({data: result});

    } catch (e) {
        console.error(`Error getting partial info for book ids ${bookIds}: `, e);
        return res.status(500).json({ message: "Internal server error"});
    }

}


// Route 3 - POST /books/search
async function searchBooks(req, res) {
    // Author
    // Category
    // Classfication
    // Time Period - 1, 2, 3, 4, 5
    // Film Adaptation - true
    const { title, author, category, classification, timePeriod, film } = req.body.data;
    // console.log(title);
    let queryStr = `
        SELECT ab.id, ab.title, ab.image, ab.classification,
            ab.categories, ROUND(AVG(ar.review_score),2) AS avg_rating
            FROM amazon_books ab
                LEFT JOIN books_rating ar ON ab.id = ar.book_id 
                LEFT JOIN authors ba ON ab.id = ba.id
        `;
    
    if (!title && !author && !category && !classification && !timePeriod && !film) {
        return res.status(400).json({message: "No search criteria provided. "})
    }

    if (title) {
        try {
            queryStr += `
                WHERE ab.title ILIKE $1
                GROUP BY ab.id, ab.title, ab.image, ab.classification, ab.categories
                LIMIT 100;
                `;
            const bookResults = await db.query(queryStr, [`%${title}%`]);
            const result = bookResults.rows
                .map((r) => ({
                    isbn: r.id,
                    title: r.title,
                    image: r.image,
                    classification: r.classification,
                    category: r.categories,
                    average_rating: r.avg_rating
                }));
            return res.status(200).json({ data: result});
        } catch (e) {
            console.error(`Error getting search results based on title: `, e);
            return res.status(500).json({ message: "Internal server error"});
        }
    }

    let count = 0;
    let inputs = [];
    queryStr += ' WHERE '

    if (author) {
        count += 1;
        queryStr += ` ba.authors ILIKE $${count} `;
        inputs.push(`%${author}%`);
    }

    if (category) {
        count += 1;
        if (count > 1) {
            queryStr += ` AND `;
        }
        queryStr += ` ab.categories=$${count} `;
        inputs.push(category);
    }

    if (classification) {
        count += 1;
        if (count > 1) {
            queryStr += ` AND `;
        }
        queryStr += ` ab.classification=$${count} `;
        inputs.push(classification);
    }

    // 1 WHEN bb.time_period_start >= 2000 AND bb.time_period_end <= 2024 THEN 'modern'
    // 2 WHEN bb.time_period_start >= 1900 AND bb.time_period_end <= 1999 THEN '20th_century'
    // 3 WHEN bb.time_period_start >= 1800 AND bb.time_period_end <= 1899 THEN '19th_century'
    // 4 WHEN bb.time_period_start >= 500 AND bb.time_period_end <= 1499 THEN 'medieval'
    // 5 WHEN bb.time_period_end < 500 THEN 'ancient'

    if (timePeriod) {
        count += 1;
        if (count > 1) {
            queryStr += ` AND `;
        }
        if (timePeriod == 1) {
            queryStr += ' ab.time_period_start >= 2000 ';
        } else if (timePeriod == 2) {
            queryStr += ' ab.time_period_start >= 1900 AND ab.time_period_end <= 1999 ';
        } else if (timePeriod == 3) {
            queryStr += ' ab.time_period_start >= 1800 AND ab.time_period_end <= 1899 ';
        } else if (timePeriod == 4) {
            queryStr += ' ab.time_period_start >= 500 AND ab.time_period_end <= 1499 ';
        } else if (timePeriod == 5) {
            queryStr += ' ab.time_period_end < 500 ';
        } else {
            return res.status(400).json({ message: "Invalid time period value." });
        }
    }

    if (film) {
        count += 1;
        if (count > 1) {
            queryStr += ` AND `;
        }
        queryStr += ` ab.film_name IS NOT NULL `;
    }

    queryStr += `GROUP BY ab.id, ab.title, ab.image, ab.classification, ab.categories 
        LIMIT 100;
    `;

    try {
        const bookResults = await db.query(queryStr, inputs);
        const result = bookResults.rows
            .map((r) => ({
                isbn: r.id,
                title: r.title,
                image: r.image,
                classification: r.classification,
                category: r.categories,
                average_rating: r.avg_rating
            }));
        return res.status(200).json({ data: result});
    } catch(e) {
        console.error(`Error getting search results: `, e);
        return res.status(500).json({ message: "Internal server error"});
    }

}



module.exports = {
    getBookFullInfo,
    getBooksPartialInfo,
    searchBooks,

}