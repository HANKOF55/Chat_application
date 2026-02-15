import { prisma } from "../config/prisma.config.js";
import { io } from "../socket/socket.js";
import { getReceiverSocketId } from "../socket/socket.js";


// chat history controller
export const getChatHistory = async (req, res) => {
    try {

        // get the userId from jwt token paylod\
        const payload = req.payloadData;
        const userId = payload.id;

        const { friendId } = req.params;

        const friendIdInt = parseInt(friendId);

        // find if friendship exists
        const friendship = await prisma.friendship.findFirst({
            where: {
                OR: [
                    { user1Id: userId, user2Id: friendIdInt },
                    { user1Id: friendIdInt, user2Id: userId }
                ]
            }
        })


        if (!friendship) {
            return res.status(403).json({
                success: false,
                error: {
                    message: "Not fried with this user",
                    code: "FORBIDDEN"
                }
            })
        }

        // get all the messages between current user and user's friend

        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId: userId, receiverId: friendIdInt },
                    { senderId: friendIdInt, receiverId: userId }
                ]
            },
            include: {
                sender: {
                    select: { id: true, username: true }
                },
                receiver: {
                    select: { id: true, username: true }
                }
            }
        })


        return res.status(200).json({
            success: true,
            data: {
                messages
            }
        })



    } catch (err) {
        console.log("history error: ", err);
        return res.status(500).json({
            success: false,
            error: {
                message: "Internal server error",
                code: "INTERNAL_SERVER_ERROR"
            }
        })
    }
}

// send Message controller
export const sendMessage = async (req, res) => {
    try {
        const payload = req.payloadData;
        const senderId = payload.id;

        const receiverId = req.params.id

        const { content } = req.body;

        const receiverIdInt = parseInt(receiverId);

        if (!receiverIdInt || !content) {
            return res.status(400).json({
                success: false,
                error: {
                    message: "Content and receiver required",
                    code: "BAD_REQUEST"
                }
            });
        }

        const message = await prisma.message.create({
            data: {
                content,
                senderId,
                receiverId: receiverIdInt
            },
            select: {
                id: true,
                content: true,
                senderId: true,
                receiverId: true,
                createdAt: true,

                sender: {
                    select: { id: true, username: true }
                }
            }

        }
        );

        // enable Socket.io, send message quickly
        const receiverSocketId = getReceiverSocketId(receiverIdInt);

        if (receiverSocketId) {
            console.log(`Sending to socket ${receiverSocketId}:`, message);
            io.to(receiverSocketId).emit("newMessage", message);
        } else {
            console.log(`User ${receiverIdInt} is offline`);
        }


        return res.status(200).json({
            success: true,
            data: message
        });

    } catch (err) {

        console.log("error while sending messages: ", err)
        return res.status(500).json({
            success: false,
            error: {
                message: "Internal server error",
                cdoe: "INTERNAL_SERVER_ERROR"
            }
        });
    }
};
