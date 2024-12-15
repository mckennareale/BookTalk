const db = require('../db');

// Route 9 - GET /books/set_in_location_recs
// 
async function getLocationRecs(req, res) {

    // get user id
    const uid = req.userId;
    // const uid = '15';
    // if (!uid) {
    //     return res.status(401).json({ message: 'Unauthorized user' });
    // }

    try {
        // get longitude, latitude and date_of_birth from app_users for the specific user
        // const userDataQuery = await db.query(`
        //     SELECT 
        //         c.longitude, 
        //         c.latitude, 
        //         u.date_of_birth
        //     FROM app_users u JOIN cities c ON u.location_id = c.setting_id
        //     WHERE u.id = $1;
        // `, [uid]);
        // if (userDataQuery.rows.length === 0) {
        //     return res.status(404).json({ message: 'User not found' });
        // }

        // // console.log("runs first query")
    
        // const { longitude, latitude, date_of_birth: dob } = userDataQuery.rows[0];
        // // console.log(`Longitude: ${longitude}, Latitude: ${latitude}, Date of Birth: ${dob}`);
        
        // // Ensure longitude and latitude are numbers
        // const long = parseFloat(longitude);
        // const lat = parseFloat(latitude);
        
        // // Validate that the values are valid numbers
        // if (isNaN(long) || isNaN(lat)) {
        //     return res.status(400).json({ message: 'Invalid coordinates' });
        // }
        
        // console.log(`Longitude: ${long}, Latitude: ${lat}`);

        // get userAge 
        // const birthDate = new Date(dob);
        // const today = new Date();
        // const age = today.getFullYear() - birthDate.getFullYear();
        // const m = today.getMonth() - birthDate.getMonth();
        // if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        //     age--;
        // }
        // console.log(`User Age: ${age}`);
        // console.log("gets to calculating age");

        const sanitizedUid = uid.replace(/-/g, '_'); 
        const viewName = `user_${sanitizedUid}_location_view`;

        const locationRecsResult = await db.query(`
            SELECT
            c.setting_id,
            c.city,
            c.country_name,
            c.latitude,
            c.longitude,
            COUNT(*) AS num_books_set_in, 
            AVG(avg_review_score) as avg_reviews
            FROM cities c
            JOIN ${viewName} b ON c.setting_id = b.setting_id
            GROUP BY c.setting_id, c.city, c.country_name, c.latitude, c.longitude
            ORDER BY avg_reviews DESC, num_books_set_in DESC
            LIMIT 5;
        `, );
        
        // Check if there are any results
        if (locationRecsResult.rows.length === 0) {
            // return res.status(400).json({ message: `No location recommendations found.` });
            console.log("No location recommendations found.")
        }
        
        // Map the results correctly
        const result = locationRecsResult.rows.map(row => ({
            id: row.setting_id,
            city: row.city,
            country: row.country_name,
            latitude: row.latitude,
            longitude: row.longitude
        }));
        
        // Return the result
        return res.status(200).json(result);
        

    } catch (error) {
        console.error('Error fetching user data:', error);
        return res.status(200).json({ message: 'Internal server error' });
    }
    
}


module.exports = {
    getLocationRecs,
}