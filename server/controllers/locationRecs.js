import { query } from '../db';

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

        

    } catch (error) {
        console.error('Error fetching user data:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
    
}



export default {
    getLocationRecs,
}