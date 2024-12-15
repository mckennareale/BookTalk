const db = require('../db');

async function getCategoryRecs(req, res) {
    // input is app_user.age and app_user.lat and app_user.long
    // $1 = user_id,  $2 = num_app_user_top_categories, $3 = num_overlap_required
    // -- test user ID = A1FQM00JX1FK4R
    // -- test book id = 158595294X
    // -- top category = fiction
    const similar = req.query.similar;
    // const user_id = 'A1FQM00JX1FK4R';
    const user_id = req.userId;
    const num_app_user_top_categories = 10;
    const num_overlap_required = 1;
    if (!user_id) {
        return res.status(400).json({message: 'Missing user id'});
    }
    // if (!num_app_user_top_categories) {
    //     num_app_user_top_categories = 0;
    // }
    // if (!num_overlap_required) {
    //     num_overlap_required = 0;
    // }
    try {
// Route 12 - GET api/category_recs: Recommend top categories of similar users
        // if similar = 1
        if (similar == 1) {
            categoryResult = await db.query(`
                WITH user_categories_rank AS (
                    SELECT LOWER(categories) AS categories,
                    COUNT(r.book_id) AS user_cnt,
                    ROW_NUMBER() OVER (ORDER BY COUNT(r.book_id) DESC) AS rank
                    FROM has_reviewed r JOIN amazon_books ab
                                        on r.book_id = ab.id
                    WHERE r.user_id = '${user_id}' AND categories IS NOT NULL
                    GROUP BY categories
                    LIMIT 10
                ),
                similar_bx_users AS (
                SELECT bu.id AS bx_user_ids,
                COUNT(DISTINCT bb.category) AS overlap_count
                FROM bx_books bb
                JOIN bx_reviews br ON bb.isbn = br.isbn
                JOIN bx_users bu ON br.user_id = bu.id
                WHERE category IN (SELECT LOWER(categories) AS categories FROM user_categories_rank)
                GROUP BY bu.id
                HAVING COUNT(DISTINCT bb.category) > 1
                )
                SELECT DISTINCT category
                FROM bx_books bb2
                JOIN bx_reviews br2 ON bb2.isbn = br2.isbn
                JOIN bx_users bu2 ON br2.user_id = bu2.id
                WHERE bb2.category IS NOT NULL
                AND bu2.id IN (SELECT bx_user_ids FROM  similar_bx_users)
                AND category NOT IN (SELECT categories FROM user_categories_rank)
                AND category IN (SELECT LOWER(categories) AS categories FROM amazon_books)
                LIMIT 10;
        `);
        //  [user_id, num_app_user_top_categories, num_overlap_required]
        if (categoryResult.rows.length === 0) {
                return res.status(200).json([]);
            }
            const result = categoryResult.rows.map(row => row.category);
            return res.status(200).json(result);
        } 
// Route 13 - GET api/category_recs: Get top categories from bx users who have never read books in app user’s categories
        else if (similar == 0) {
            try {
                console.log("Executing query for similar=0");
                const categoryResult = await db.query(`
               WITH user_categories AS (
    SELECT DISTINCT categories
    FROM has_reviewed r
    JOIN amazon_books ab ON r.book_id = ab.id
    WHERE r.user_id = 'db2f6fe4-6422-4d70-8183-177b56b9a855'
),
bx_users_same_cat AS (
    SELECT DISTINCT bu.id AS bx_user_ids
    FROM bx_books bb
    JOIN bx_reviews br ON bb.isbn = br.isbn
    JOIN bx_users bu ON br.user_id = bu.id
    WHERE EXISTS (
        SELECT 1
        FROM user_categories uc
        WHERE bb.category = uc.categories
    )
),
bx_users_diff_cat AS (
    SELECT bu.id
    FROM bx_users bu
    WHERE NOT EXISTS (
        SELECT 1
        FROM bx_users_same_cat same_cat
        WHERE same_cat.bx_user_ids = bu.id
    )
)
SELECT bb3.category
FROM bx_books bb3
JOIN bx_reviews br3 ON bb3.isbn = br3.isbn
JOIN bx_users bu3 ON br3.user_id = bu3.id
WHERE EXISTS (
    SELECT 1
    FROM bx_users_diff_cat diff_cat
    WHERE diff_cat.id = bu3.id
)
AND EXISTS (
    SELECT 1
    FROM amazon_books ab
    WHERE ab.categories = bb3.category
)
GROUP BY bb3.category
ORDER BY COUNT(br3.rating) DESC, AVG(br3.rating) DESC
LIMIT 10;`);

                console.log("Query results:", categoryResult.rows);

                if (categoryResult.rows.length === 0) {
                    return res.status(200).json([]);
                }
                
                const result = categoryResult.rows.map(row => row.category);
                return res.status(200).json(result);
            } catch (dbError) {
                console.error("Database error:", dbError);
                return res.status(500).json({ 
                    message: "Database error",
                    error: dbError.message 
                });
            }
        }
        
    } catch(e) {
        console.error(`Error getting recommendations for ${user_id}: `, e);
        return res.status(500).json({ 
            message: "Internal server error",
            error: e.message
        });
    }
}

module.exports = {
    getCategoryRecs,
}