
import { prisma } from "../config/prisma.config.js";


export const getAllUsers = async (req, res) => {
    try {

        const payload = req.payloadData;
        const userId = payload.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                error: {
                    message: "Please login to view users.",
                    code: "UNAUTHORIZED"

                }
            })
        }

        const users = await prisma.user.findMany({});

        return res.status(200).json({
            success: true,
            data: users
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            error: {
                message: "Internal server error",
                code: "INTERNAL_SERVER_ERROR"
            }
        })
    }
}