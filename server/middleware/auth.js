const authMiddleware = (req, res, next) => {
    
    
    /******** TO DO *******/

    // console.log("AUTH middleware");
    // const uid = req.headers['Authorization'];
    // if (!uid) {
    //     return res.status(401).json({ message: "Unauthorized user. No user id provided." });
    // }

    // console.log("User id: ", uid);
    req.userId = uid;
    return next();

};

module.exports = authMiddleware;