const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {

    console.log("AUTH middleware");

    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        
        try {
            const authData = jwt.verify(bearerToken, process.env.JWT_SECRET);
            req.userId = authData.id;
            next();
        } catch (e) {
            return res.status(401).json({ message: "Unable to authenticate user. "});
        }
        
    } else {
        console.error("Missing auth token. ");
        return res.status(403).json({ message: "Missing authorization token." });
    }

};

module.exports = authMiddleware;