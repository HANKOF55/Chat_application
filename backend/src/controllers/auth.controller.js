import { prisma } from "../config/prisma.config.js";
import bcrypt, { hash } from "bcrypt";
import { generateToken } from "../middlewares/jwt.middleware.js";

// user register controller
export const registerUser = async (req, res) => {

    try {
        const { username, email, password } = req.body;

        // check if all required fields are provided
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                error: {
                    message: "All fields are required.",
                    code: "BAD_REQUEST"
                }
            });
        }

        const emailNormalized = email.toLowerCase();

        // check if user with the same email already exists.
        const existingUser = await prisma.user.findUnique({ where: { email: emailNormalized } });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                error: {
                    message: "User already exists",
                    code: "CONFLICT"
                }
            });
        }

        // check if password is at least 8 characters long
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                error: {
                    message: "Password must be at least 8 characters long",
                    code: "BAD_REQUEST"
                }
            });
        }

        // hash the password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        // create new user in database
        const newUser = await prisma.user.create({
            data: {
                username,
                email: emailNormalized,
                password: hashedPassword,
            }
        });


        return res.status(201).json({
            data: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
            },
        });

    } catch (err) {
        console.log("error in registerUser controller: ", err);
        return res.status(500).json({
            success: false,
            error: {
                message: "Internal Server Error",
                code: "INTERNAL_SERVER_ERROR"
            }
        });
    }

}

// user login controller
export const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body;

        // check if all required fields are provided
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: {
                    message: "Please fill the required fields.",
                    code: "MISSING_CREDENTIALS"
                }
            });
        }

        const emailNormalized = email.toLowerCase();

        // find the user
        const user = await prisma.user.findUnique({ where: { email: emailNormalized } })

        // check user's password
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({
                error: {
                    message: "Invalid username or password.",
                    code: "INVALID_CREDENTIALS"
                }
            });
        }

        // create payload for jwt token
        const payload = {
            id: user.id,
            email: user.email
        }

        // generate token for login
        const token = generateToken(payload);

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: false
        })
        // res.cookie("token", token);

        return res.status(200).json({
            success: true,
            data: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            error: {
                message: "Internal Server Error",
                code: "INTERNAL_SERVER_ERROR"
            }
        })
    }
}

// user logout controller
export const logoutUser = async (req, res) => {

    try {
        // get the user id from verified jwt token's payload
        const userId = req.payloadData.id;

        res.clearCookie("token");

        return res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });

    } catch (err) {
        return res.status(500).json(
            {
                success: false,
                error: {
                    message: "Internal server error.",
                    code: "INTERNAL_SERVER_ERROR"
                }
            }
        );
    }

}

// current loggedin user controller
export const getCurrentUser = async (req, res) => {
    try {

        // Check if payloadData exists and has an id
        const payload = req.payloadData;

        if (!payload || !payload.id) {
            return res.status(401).json({
                success: false,
                error: {
                    message: "Invalid or missing authorization payload.",
                    code: "INVALID_TOKEN_PAYLOAD"
                }
            });
        }

        const userId = payload.id;

        // find the existing user with current payload id
        const user = await prisma.user.findUnique({ where: { id: userId } });

        // if user not found in DB
        if (!user) {
            return res.status(404).json({
                success: false,
                error: {
                    message: "User not found.",
                    code: "USER_NOT_FOUND"
                }
            });
        }

        return res.status(200).json({
            success: true,
            data: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });

    } catch (err) {
        console.error("Error in getMe:", err);
        return res.status(500).json({
            success: false,
            error: {
                message: err.message || "Internal server error.",
                code: "INTERNAL_SERVER_ERROR"
            }
        });
    }
}

