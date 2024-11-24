const db = require('../db');
const passport = require('passport');
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
        console.error("Error with user login: ", e);
        return res.status(500).json({message: "Internal server error. "});
    }
    
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


async function googleLogin(req, res) {
    // if google
        // check using google id
    // if facebook
        // check using fb id

    // if new user
        // generate new uid, attach to req
        // add new user entry to db
        // issue jwt
        // log in
}

async function facebookLogin(req, res) {

}

module.exports = {
    passwordLogin,
    googleLogin,
    facebookLogin,

}