const db = require('../db');

const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const saltRounds = 10; 
const jwt = require('jsonwebtoken');

async function passwordLogin(req, res) {
    
    const validResult = validationResult(req);
    if (!validResult.isEmpty()) {
        return res.status(401).json({message: "Missing or invalid email / password"});
    }
    const { email, password } = req.body;
    let uid = null;
    let newUser = false;

    try {
        const checkUserExists = await db.query(`
            SELECT id, password_hash
            FROM app_users
            WHERE email=$1;
            `, [email]);
        
        if (checkUserExists.rows.length === 0) {
            newUser = true;
            uid = uuidv4();
            const hash = await bcrypt.hash(password, saltRounds);
            
            const dbResult = await db.query(`
                INSERT INTO app_users
                (id, location_id, date_of_birth, email, password_hash)
                VALUES ($1, null, null, $2, $3);
                `, [uid, email, hash]);

        } else {
            uid = checkUserExists.rows[0].id;
            const password_hash = checkUserExists.rows[0].password_hash;
            const match = await bcrypt.compare(password, password_hash);
            if (!match) {
                return res.status(401).json({message: "Incorrect password. "});
            }
        }
    } catch (e) {
        console.error("Error with user login (DB query): ", e);
        return res.status(500).json({message: "Internal server error. "});
    }
    
    try {

        const token = jwt.sign({id: uid}, process.env.JWT_SECRET, { expiresIn: '7d' });
        
        if (!newUser) {
            return res.status(200).json({
                message: "Logged in",
                token: token,
                uid: uid,
                newUser: false,
            });
        } else {
            return res.status(200).json({
                message: "New user created and logged in",
                token: token,
                uid: uid,
                newUser: true,
            });
        }
    } catch (e) {
        console.error('Error generating JWT:', e.message);
        return res.status(500).json({message: "Error with token generation. "});
    }
    
}


async function googleLogin(req, res) {
    
    let uid = null;
    let newUser = false;
    const googleId = req.user?.id;

    if (!googleId) {
        console.error("Missing google id. ");
        return res.status(400).json({message: "Missing google id. "});
    }

    try {
        const checkUserExists = await db.query(`
            SELECT id
            FROM app_users
            WHERE google_id=$1;
            `, [googleId]);
        
        if (checkUserExists.rows.length === 0) {
            newUser = true;
            uid = uuidv4();
            
            await db.query(`
                INSERT INTO app_users
                (id, location_id, date_of_birth, google_id)
                VALUES ($1, null, null, $2);
                `, [uid, googleId]);
        } else {
            uid = checkUserExists.rows[0].id; 
        }
    } catch (e) {
        console.error("Error with user login (DB query): ", e);
        return res.status(500).json({message: "Internal server error. "});
    }
    
    try {
        const sessionId = uuidv4();
        req.app.locals.sessions = req.app.locals.sessions || {};
        req.app.locals.sessions[sessionId] = { googleId: req.user.id };
        
        const frontendUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?sessionId=${encodeURIComponent(sessionId)}&newUser=${encodeURIComponent(newUser)}`;

        return res.redirect(frontendUrl);
        
    } catch (e) {
        console.error('Error generating JWT:', e.message);
        return res.status(500).json({message: "Error with token generation. "});
    }

}

async function facebookLogin(req, res) {
    let uid = null;
    let newUser = false;
    
    /***********  TO DO ***********/

    
    try {

        const token = jwt.sign({id: uid}, process.env.JWT_SECRET, { expiresIn: '7d' });
        
        if (!newUser) {
            return res.status(200).json({
                message: "Logged in",
                token: token,
                uid: uid
            });
        } else {
            return res.status(200).json({
                message: "New user created and logged in",
                token: token,
                uid: uid
            });
        }
    } catch (e) {
        console.error('Error generating JWT:', e.message);
        return res.status(500).json({message: "Error with token generation. "});
    }
}

async function retrieveToken(req, res) {
    const sessionId = req.query.sessionId;
    if (!req.app.locals.sessions[sessionId]) {
        return res.status(400).json({ message: 'Invalid or expired session ID.' });
    }
    let uid = null;
    const googleId = req.app.locals.sessions[sessionId].googleId;
    
    try {
        const result = await db.query(
            `SELECT id FROM app_users WHERE google_id = $1`,
            [googleId]
        );
        if (result.rows.length === 0) {
            return null;
        }
        uid = result.rows[0].id; // Return the UID
        const token = jwt.sign({ id: uid }, process.env.JWT_SECRET, { expiresIn: '7d' });
        delete req.app.locals.sessions[sessionId];
        res.status(200).json({ token, uid });
    } catch (error) {
        console.error("Error querying database for googleId:", error);
        res.status(500).json({ message: 'Internal server error (googleId db query).' });
    }
    
}

module.exports = {
    passwordLogin,
    googleLogin,
    facebookLogin,
    retrieveToken,
}