const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    // console.log('authHeader',{authHeader})

    if(!authHeader?.startsWith('Token')){
        // console.log('Invalid Authorization Header:', authHeader);
        return res.status(401).json({message: "Unauthorized: Missing token"});
    }
    const token = authHeader.split(' ')[1];
    // console.log('Token Received: ', token);

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if(err){
                // console.log('Token verification error:', err);
                return res.status(403).json({message: "Forbidden"});
            }

            // console.log('Decoded Token: ', decoded);

            // Assign user details from the nested 'user' object in the decoded payload
            // The password is NOT included in the token payload, which is good for security.
            // So, req.userHashedPass will be undefined if you try to access it from the token.
            req.userId = decoded.user.id;
            req.userEmail = decoded.user.email;
            // If you need the password, you'd fetch it from the database using req.userId or req.userEmail
            // Do NOT try to get hashed password from the JWT payload.

            // Log the assigned values to the request object
            // console.log("req.userId: ", req.userId);
            // console.log("req.userEmail: ", req.userEmail);
            // console.log('User Details (from token):', { userId: req.userId, userEmail: req.userEmail });
            next();
        }
    )
}

module.exports = verifyJWT;