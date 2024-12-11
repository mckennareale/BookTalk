const db = require('../db');

// Route GET /cities/:country
async function getCitiesInCountry(req, res) {
    const uid = req.userId;
    if (!uid) {
        console.log("missing uid");
        return res.status(401).json({ message: 'Unauthorized user' });
    }

    const country = req.params.country;
    const searchTerm = req.query.query || ''; 

    if (!country) {
        return res.status(400).json({message: 'Missing country name'});
    }

    try {
        const citiesResult = await db.query(`
            SELECT setting_id AS city_id, city
            FROM cities
            WHERE country_name=$1 AND city ILIKE $2
            LIMIT 100;
            `, [country, `%${searchTerm}%`]);
        
        const result = {
            cities_list: 
            (citiesResult.rows.length === 0) ? [] : citiesResult.rows
        };

        return res.status(200).json(result);

    } catch(e) {
        console.error(`Error getting cities list for country ${country}: `, e);
        return res.status(500).json({ message: "Internal server error"});
    }
}


module.exports = {
    getCitiesInCountry,
}