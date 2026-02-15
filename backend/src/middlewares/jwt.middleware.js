// core modules
import jwt from "jsonwebtoken";

// Function for validating JWT token
export const jwtAuthMiddleware = (req, res, next) => {

    // check cookies has jwt token or not.
    let token = req.cookies.token;

    // If token not in cookies, check Authorization header
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Invalid Token."
        })
    }

    try {

        // Verify the JWT token and get the payload 
        const decode = jwt.verify(token, process.env.JWT_SECRET);

        // Attatch payload to request object with key name
        req.payloadData = decode;
        next();

    } catch (err) {
        return res.status(401).json({
            success: false,
            message: "Invalid Token"
        })
    }

}

// Function for generating JWT Token
export const generateToken = (userData) => {

    // Generating a new JWT token using user data 
    return jwt.sign(userData, process.env.JWT_SECRET);
}

