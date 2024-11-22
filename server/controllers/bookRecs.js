const db = require('../db');

// TODO -- this does not work 
// Route 6,7,8,10 - GET /book_recs?criteria=X&book_id=Y
async function getBookRecs(req, res) {
    const criteria = req.query.criteria;
    const book_id = req.query.book_id;

    const user_id = '15';
    const limit = 5;

    if (!user_id) {
        return res.status(400).json({ message: 'Missing or invalid user ID' });
    }

    // if (!criteria) {
    //     return res.status(400).json({ message: 'Missing or invalid criteria' });
    // }
    // if (!book_id) {
    //     return res.status(400).json({ message: 'Missing or invalid book ID' });
    // }

    let query;
    switch (criteria) {
        case 'top_categories':
            query = `
                WITH top_app_user_author as
                (
                SELECT a.authors, COUNT(hr.book_id) as review_count FROM has_reviewed hr
                JOIN authors a on hr.book_id = a.id
                WHERE hr.user_id = ${user_id}
                GROUP BY a.authors
                ORDER BY review_count DESC
                LIMIT 5
                )
                SELECT ab.id, ar.review_score FROM amazon_books ab
                LEFT JOIN books_rating ar on ab.id = ar.book_id
                LEFT JOIN authors a on ab.id = a.id
                WHERE a.authors IN (SELECT authors from top_app_user_author)
                GROUP BY ab.id, ab.authors, ar.review_score
                ORDER BY ar.review_score
                LIMIT ${limit};
                `;
            break;
        case 'top_authors':
            query = ``;
            break;
        case 'similar_age':
            query = ``;
        case 'classification':
            query = ``;
            break;
        default:
            return res.status(400).json({ message: 'Invalid criteria' });
    }

    try {
        const result = await db.query(query); // Execute the query
        return res.status(200).json({ data: result.rows }); // Send the results
    } catch (error) {
        console.error('Error executing query:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }

}

// Route 11 - GET /period_books_rec
async function getPeriodBookRecs(req, res) {
    try {
        const periodResult = await db.query(`
            WITH period_lover_users AS (
                SELECT
                    br.user_id,
                    CASE
                        WHEN bb.time_period_start >= 2000 AND bb.time_period_end < 2024 THEN 'modern'
                        WHEN bb.time_period_start >= 1900 AND bb.time_period_end <= 1999 THEN '20th_century'
                        WHEN bb.time_period_start >= 1500 AND bb.time_period_end <= 1899 THEN '19th_century'
                        WHEN bb.time_period_start >= 500 AND bb.time_period_end <= 1499 THEN 'medieval'
                        WHEN bb.time_period_end  < 500 THEN 'ancient'
                        ELSE 'unknown'
                    END AS period_type,
                    COUNT(*) AS num_books_reviewed
                FROM bx_users bu
                JOIN bx_reviews br ON bu.id = br.user_id
                JOIN bx_books bb ON bb.isbn = br.isbn
                GROUP BY br.user_id, period_type
                HAVING COUNT(*) > 1
                ORDER BY num_books_reviewed DESC
            ),
            -- Setting period for each book
            book_reviews_with_periods AS (
                SELECT
                    br.user_id,
                    br.isbn,
                    br.rating,
                    bb.title,
                    bb.author,
                    bb.time_period_start,
                    bb.time_period_end,
                    CASE
                        WHEN bb.time_period_start >= 2000 AND bb.time_period_end < 2024 THEN 'modern'
                        WHEN bb.time_period_start >= 1900 AND bb.time_period_end < 1999 THEN '20th_century'
                        WHEN bb.time_period_start >= 1800 AND bb.time_period_end < 1899 THEN '19th_century'
                        WHEN bb.time_period_start >= 500 AND bb.time_period_end < 1499 THEN 'medieval'
                        WHEN bb.time_period_end < 500 THEN 'ancient'
                        ELSE 'unknown'
                    END AS period_type
                FROM bx_reviews br
                JOIN bx_books bb ON br.isbn = bb.isbn
            ),
            -- Selecting a period lover for each period from the list (introducing randomness in selection)
            selected_period_lover AS (
                SELECT
                    plu.user_id,
                    plu.period_type,
                    ROW_NUMBER() OVER (
                        PARTITION BY plu.period_type
                        ORDER BY RANDOM()
                    ) AS rank
                FROM period_lover_users plu
            ),
            period_lover_bookshelves AS (
                SELECT  spl.period_type,spl.user_id,ARRAY_AGG(bt.isbn) AS isbns FROM selected_period_lover spl
                LEFT JOIN book_reviews_with_periods bt ON spl.user_id = bt.user_id
                WHERE spl.period_type != 'unknown'
                AND rank = 1
                AND bt.period_type = spl.period_type
                GROUP BY spl.user_id, spl.period_type
            )
            SELECT * FROM period_lover_bookshelves;
        `);
        if (periodResult.rows.length === 0) {
            return res.status(404).json({ message: 'No period book recommendations found' });
        }
        return res.status(200).json({ data: periodResult.rows });
    } catch (error) {
        console.error('Error fetching period book recommendations:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    getBookRecs,
    getPeriodBookRecs,
}