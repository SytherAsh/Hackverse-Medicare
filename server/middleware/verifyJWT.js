const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
    // Check if the token is in the Authorization header
    let token = req.headers['authorization']?.split(' ')[1];

    // If no token in header, check the cookies
    if (!token) {
        token = req.cookies?.jwt;
        console.log("token:",token);
    }

    // const authHeader = req.headers.authorization || req.headers.Authorization;
    // if(!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);//unauthorized
    
    // const token = authHeader.split(' ')[1]; //we split the header and access the token part of it

    // If token is still not found, return 401 Unauthorized    
    // if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.sendStatus(403); // Forbidden if token verification fails
        req.user = {
            id: decoded.UserInfo.id,
            email: decoded.UserInfo.email,
            role: decoded.UserInfo.role,
        };
        console.log("Decoded token:", decoded);
        console.log("User role from token:", decoded.UserInfo.role);
        console.log("req.user",req.user);
        next();
    });
};

module.exports = verifyJWT;
