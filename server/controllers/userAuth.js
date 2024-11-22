const db = require('../db');
const { v4: uuidv4 } = require('uuid');

async function login(req, res) {
    
    // req.userId = uid;
    let newUser = true;
    
    // if email/password, 
        // check if user exists using email 
    // if google
        // check using google id
    // if facebook
        // check using fb id

    // if existing user
        // issue jwt
        // retrieve uid, attach to req
        // log in


    // if new user
        // generate new uid, attach to req
        // add new user entry to db
        // issue jwt
        // log in
    const uid = uuidv4();
    const user = {
        id: uid
    };
    try {
        const token = jwt.sign({user}, 'secretkey', { expiresIn: '30s' });
        res.status(200).json(token);
    } catch (e) {
        return res.status(500).json({message: "Error with token geenration. "});
    }
    
}

async function passwordLogin(req, res) {
    
}

async function googleLogin(req, res) {

}

async function facebookLogin(req, res) {

}

module.exports = {
    login,
}