const db = require('../db');

// TODO -- this does not work 
// Route 6,7,8,10 - GET /book_recs?criteria=X&book_id=Y
async function getBookRecs(req, res) {
    const criteria = req.query.criteria;
    const book_id = req.query.book_id;

    const user_id = req.userId;
    const num_recs_to_return = 10;

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
        // because you loved 'author name' - returns top rated books from ONE author that the app user loves the most
        case 'top_authors':
            query = `
                WITH top_app_user_author as
                (
                SELECT a.authors as top_authors, COUNT(hr.book_id) as review_count FROM has_reviewed hr
                JOIN authors a on hr.book_id = a.id
                WHERE hr.user_id = '${user_id}'
                GROUP BY a.authors
                ORDER BY review_count DESC
                LIMIT 5
                )
                SELECT ab.id, a.authors, ab.title,ab.image,ab.classification, ab.categories, ROUND(AVG(ar.review_score)) as avg_rating
                FROM amazon_books ab
                LEFT JOIN books_rating ar on ab.id = ar.book_id
                LEFT JOIN authors a on ab.id = a.id
                WHERE a.authors IN (SELECT top_authors from top_app_user_author)
                GROUP BY ab.id, a.authors
                ORDER BY AVG(ar.review_score) DESC NULLS LAST
                LIMIT ${num_recs_to_return};
                `
            break;
            // because you loved 'category name' books - returns top rated books from ONE category that the app user loves the most
        case 'top_categories':
            query = `
            WITH top_app_user_categories as
                (
                SELECT ab.categories as top_categories, COUNT(hr.book_id) as review_count
                FROM has_reviewed hr
                JOIN amazon_books ab on hr.book_id = ab.id
                WHERE hr.user_id = '${user_id}'
                GROUP BY ab.categories
                ORDER BY review_count DESC
                LIMIT 1
                )
                SELECT ab.id, ab.title,ab.image,ab.classification, ab.categories, ar.review_score as avg_rating FROM amazon_books ab
                LEFT JOIN books_rating ar on ab.id = ar.book_id
                WHERE ab.categories IN (SELECT top_categories from top_app_user_categories)
                AND ar.review_score is not null
                GROUP BY ab.categories, ab.id, ar.review_score
                ORDER BY ar.review_score DESC
                LIMIT ${num_recs_to_return};
            `;
            break;
        case 'classification':
            query = `
            WITH top_app_user_classification AS (
            SELECT ab.classification as top_classification, COUNT(hr.book_id) as review_count
            FROM has_reviewed hr
            JOIN amazon_books ab on hr.book_id = ab.id
            JOIN authors a on ab.id = a.id
            WHERE hr.user_id = '${user_id}'
            GROUP BY ab.classification
            ORDER BY review_count DESC
            LIMIT 1)
            SELECT ab.id, ab.title, ab.image, ab.classification, ab.categories, ROUND(AVG(br.review_score), 2) as avg_rating
            FROM amazon_books ab
            LEFT JOIN books_rating br on ab.id = br.book_id
            LEFT JOIN authors a on ab.id = a.id
            WHERE
            CASE
            --        Children case --- more from the same category
                WHEN (SELECT top_classification FROM top_app_user_classification) = 'children' THEN
                        ab.classification = 'children'
                        AND ab.published_date > date_part('year', CURRENT_DATE) - 15
                        AND ab.categories in (
                            SELECT categories from has_reviewed hr
                            LEFT JOIN amazon_books ab on hr.book_id = ab.id
                            WHERE ab.classification = 'children'
                            )
                        AND br.review_score is not null
                        AND ab.id NOT IN (SELECT book_id from has_reviewed where user_id = '${user_id}')
                -- YA case -- more from the same author
                WHEN (SELECT top_classification FROM top_app_user_classification) = 'YA' THEN
                    classification = 'YA'
                    AND published_date >= date_part('year', CURRENT_DATE) - 15
                        AND a.authors in (
                            SELECT a.authors FROM has_reviewed hr
                            LEFT JOIN amazon_books ab on hr.book_id = ab.id
                            LEFT JOIN authors a on ab.id = a.id
                            WHERE hr.user_id = '${user_id}'
                            AND ab.classification = 'YA'
                        )
                        AND ab.id NOT IN (SELECT book_id from has_reviewed where user_id = '${user_id}')
                        AND br.review_score IS NOT NULL
                -- Adult case --- just top bestsellers
                WHEN (SELECT top_classification FROM top_app_user_classification) = 'adult' THEN
                    classification = 'adult'
                        AND br.review_score IS NOT NULL
                        AND ab.id NOT IN (SELECT book_id from has_reviewed where user_id = '${user_id}')
            END
            GROUP BY ab.id, ab.title, ab.image, ab.classification
            ORDER BY AVG(br.review_score) DESC
            LIMIT 10;
            `;
            break;
        default:
            return res.status(400).json({ message: 'Invalid criteria' });
    }

    try {
        console.log('Executing query:', query);
        const result = await db.query(query); // Execute the query
        console.log('Query result:', result.rows); // Log the result for debugging
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No recommendations found' });
        }
        return res.status(200).json({ data: result.rows }); // Send the results
        
    } catch (error) {
        console.error('Error executing query:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }

}

// Route 11 - GET /period_books_rec
async function getPeriodBookRecs(req, res) {
    // TODO: add limit in the query 
    const num_recs_to_return = 1;
   
    try {
        const periodResult = await db.query(`
            WITH period_lover_users AS (
                SELECT
                    brp.user_id,
                    brp.period_type,
                    COUNT(*) AS num_books_reviewed,
                    AVG(brp.rating) AS avg_rating
                FROM book_reviews_with_periods brp
                GROUP BY brp.user_id, brp.period_type
                HAVING COUNT(*) > 5
            ),
            selected_period_lover AS (
                SELECT
                    user_id,
                    period_type,
                    ROW_NUMBER() OVER (
                        PARTITION BY period_type
                        ORDER BY RANDOM() DESC
                    ) AS rank
                FROM period_lover_users
                WHERE period_type != 'unknown'
                AND num_books_reviewed > 10
                AND avg_rating > 3
            ),
            period_lover_bookshelves AS (
                SELECT  spl.period_type,spl.user_id,
                        (
                            SELECT ARRAY_AGG(isbn)
                            FROM (
                                SELECT DISTINCT bt.isbn
                                FROM book_reviews_with_periods bt
                                WHERE bt.user_id = spl.user_id
                                  AND bt.period_type = spl.period_type
                                  AND bt.rating_weight > 1.0
                                LIMIT 5
                            ) limited_isbns
                        ) AS isbns
                FROM selected_period_lover spl
                LEFT JOIN book_reviews_with_periods bt ON spl.user_id = bt.user_id
                WHERE spl.rank = 1
                AND spl.period_type != 'unknown'
                AND bt.period_type = spl.period_type
                GROUP BY spl.user_id, spl.period_type
            )
            SELECT * FROM period_lover_bookshelves
            ORDER BY period_type ASC;
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

// Route - GET /set_in_location_recs?location_id=X
async function getSetInLocationBooksRecs(req, res) {
    const location_id = req.query.location_id;
    console.log('Location ID:', location_id);

    try {
        const result = await db.query(`
            SELECT id, title, image, ROUND(AVG(br.review_score), 2) as avg_rating
            FROM amazon_books ab LEFT JOIN books_rating br ON id = book_id
            WHERE setting_id = ${location_id}
            GROUP BY id, title, image
            ORDER BY avg_rating DESC NULLS LAST
            LIMIT 25;
        `);
        return res.status(200).json({ data: result.rows });
    } catch (error) {
        console.error('Error fetching set in location recommendations:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

// Route - GET /category_books_recs?category_id=X
async function getCategoryBooksRecs(req, res) {
    const category = req.query.category;

    try {
        const result = await db.query(`
            SELECT id, title, image, ROUND(AVG(br.review_score), 2) as avg_rating
            FROM amazon_books ab LEFT JOIN books_rating br ON id = book_id
            WHERE categories = $1
            GROUP BY id, title, image
            ORDER BY avg_rating DESC NULLS LAST
            LIMIT 25;
        `, [category]);
        return res.status(200).json({ data: result.rows });
    } catch (error) {
        console.error('Error fetching category books recommendations:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

// Route - GET /get_period_books?isbns=X,Y,Z
async function getPeriodBooksRecs(req, res) {
    const isbns = req.query.isbns.split(','); // Split the comma-separated string into an array
    console.log('ISBNs:', isbns);
    
    try {
        // Create the parameterized query
        const query = {
            text: `
                SELECT bb.title, bb.author, bb.year_published, bb.category
                FROM bx_books bb
                WHERE bb.isbn = ANY($1)
            `,
            values: [isbns] // Pass the array of ISBNs as a parameter
        };
        
        const result = await db.query(query);
        return res.status(200).json({ data: result.rows });
    } catch (error) {
        console.error('Error fetching period books recommendations:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    getBookRecs,
    getPeriodBookRecs,
    getSetInLocationBooksRecs,
    getCategoryBooksRecs,
    getPeriodBooksRecs
}