const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    
    
    /******** TO DO *******/

    // console.log("AUTH middleware");
    // const uid = req.headers['Authorization'];
    // if (!uid) {
    //     return res.status(401).json({ message: "Unauthorized user. No user id provided." });
    // }

    // Get auth header value
  const bearerHeader = req.headers['authorization'];
  // Check if bearer is undefined
  if(typeof bearerHeader !== 'undefined') {
    // Split at the space
    const bearer = bearerHeader.split(' ');
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;
    // Next middleware
    next();
  } else {
    // Forbidden
    res.sendStatus(403);
  }


    // console.log("User id: ", uid);
    req.userId = uid;
    return next();

};

module.exports = authMiddleware;