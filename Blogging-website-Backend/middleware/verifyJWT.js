const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    //console.log('authHeader',{authHeader})

    if(!authHeader?.startsWith('Token')){
        return res.status(401).json({message: "Unauthorized: Missing token"});
    }
    const token = authHeader.split(' ')[1];
    //console.log('Token: ', token);

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if(err){
                //console.error('Token verification error:', err);
                return res.status(403).json({message: "Forbidden"});
            }

            //console.log('Decoded Token: ', decoded);

            req.userId= decoded.user.id;
            req.userEmail = decoded.user.email;
            req.userHashedPass = decoded.user.password;

            // console.log("userId: ", decoded.userId);
            // console.log("userEmail: ", decoded.userEmail);
            // console.log("userHashedPass: ", decoded.userHashedPass);

            // Log the extracted user details for debugging
            //console.log('User Details:', { userId: req.userId, userEmail: req.userEmail });

            next();
        }
    )
}

module.exports = verifyJWT;