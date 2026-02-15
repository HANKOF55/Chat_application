// local modules
import { empty } from "@prisma/client/runtime/client";
import { prisma } from "../config/prisma.config.js";
import { freemem } from "node:os";


// create friend request
export const sendFriendRequest = async (req, res) => {
    try {

        const payload = req.payloadData;

        const senderId = payload.id;
        const { receiverId } = req.body;

        // check if receiverId is empty
        if (!receiverId) {
            return res.status(400).json({
                success: false,
                error: {
                    message: "Sender required.",
                    code: "BAD_REQUEST"
                }
            })
        }

        const receiverIdInt = parseInt(receiverId);

        // check if user sending frend request to himself / herself
        if (senderId === receiverIdInt) {
            return res.status(400).json({
                success: false,
                error: {
                    message: "You can not send friend request to yourself.",
                    code: "BAD_REQUEST"
                }
            })
        }

        // check if receiver exist in db
        const receiverUser = await prisma.user.findUnique({ where: { id: receiverIdInt } });

        if (!receiverUser) {
            return res.status(404).json({
                success: false,
                errror: {
                    message: "User does not exist.",
                    code: "USER_NOT_FOUND"
                }
            })
        }

        // check if sender user and receiver user are already friends
        const isFriends = await prisma.friendship.findFirst({
            where: {
                OR: [
                    { user1Id: senderId, user2Id: receiverIdInt },
                    { user1Id: receiverIdInt, user2Id: senderId }
                ]
            }
        })

        if (isFriends) {
            return res.status(409).json({
                success: false,
                error: {
                    message: "Already friends",
                    code: "CONFLICT"
                }
            })
        }

        // check if friend request already exist
        const isRequested = await prisma.friendRequest.findFirst({
            where: {
                OR: [
                    { senderId: senderId, receiverId: receiverIdInt },
                    { senderId: receiverIdInt, receiverId: senderId }
                ]
            }
        });

        if (isRequested) {
            return res.status(409).json({
                success: false,
                error: {
                    message: "Friend request alreayd exists",
                    code: "CONFLICT"
                }
            })
        }

        // if everything find then create a friendRequest
        const friendRequest = await prisma.friendRequest.create({
            data: {
                senderId: senderId,
                receiverId: receiverIdInt
            }
        });

        const sender = await prisma.user.findUnique({
            where: { id: senderId }
        })

        return res.status(201).json({
            success: true,
            message: "Friend request sent",
            data: {
                sender: {
                    id: sender.id, username: sender.username, email: sender.email
                },
                receiver: {
                    id: receiverUser.id, username: receiverUser.username, email: receiverUser.email
                }
            }
        })


    } catch (err) {
        console.log("err while request: ", err);
        return res.status(500).json({
            success: false,
            error: {
                message: "Internal server error",
                code: "INTERNAL_SERVER_ERROR"
            }
        })
    }
}

// gett all the pending requests
export const getPendingRequests = async (req, res) => {
    try {

        const payload = req.payloadData;
        const userId = payload.id;

        // get all the pending requests for current user
        const pendingRequestsId = await prisma.friendRequest.findMany({
            where: {
                receiverId: userId
            }
        })

        // get data of each pending request user
        const pendingRequests = await Promise.all(
            pendingRequestsId.map(async (pendingRequestId) => {
                const sender = await prisma.user.findUnique({ where: { id: pendingRequestId.senderId } })
                return sender
            })
        )

        return res.status(200).json({
            success: true,
            data: pendingRequests
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

// accept friend request
export const acceptFriendRequest = async (req, res) => {
    try {

        const payload = req.payloadData;
        const userId = payload.id;

        const requestId = req.body.receiverId;

        // check if requestId is empty
        if (!requestId) {
            return res.status(400).json({
                success: false,
                error: {
                    message: "Request Id required.",
                    code: "BAD_REQUEST"
                }
            })
        }

        const requestIdInt = parseInt(requestId)

        // check if request exist in friendRequest table
        const request = await prisma.friendRequest.findFirst({
            where: {
                senderId: requestIdInt,
                receiverId: userId
            }
        });

        // if request does not exist
        if (!request) {
            return res.status(404).json({
                success: false,
                error: {
                    message: "Request not found",
                    code: "RESOURCE_NOT_FOUND"
                }
            })
        }

        // create friendship and delete existing request
        const friendship = await prisma.friendship.create({
            data: {
                user1Id: request.senderId,
                user2Id: request.receiverId
            }
        })

        // delete requst 
        await prisma.friendRequest.delete({
            where: {
                id: request.id
            }
        })

        return res.status(200).json({
            success: true,
            message: "Friend request accepted"
        })

    } catch (err) {
        console.log("error while accepting friend: ", err);
        return res.status(500).json({
            success: false,
            error: {
                message: "Internal server error",
                code: "INTERNAL_SERVER_ERROR"
            }
        })
    }
}

// Reject friend request
export const rejectFriendRequest = async (req, res) => {
    try {

        const payload = req.payloadData;
        const userId = payload.id;

        const requestId = req.body.receiverId;

        // check if requestId is empty
        if (!requestId) {
            return res.status(400).json({
                success: false,
                error: {
                    message: "Request Id required",
                    code: "BAD_REQUEST"
                }
            })
        }

        const requestIdInt = parseInt(requestId);

        const request = await prisma.friendRequest.findFirst({
            where: {
                senderId: requestIdInt,
                receiverId: userId
            }
        })

        // check if request exist in the table
        if (!request) {
            return res.status(404).json({
                success: false,
                error: {
                    message: "Request not found",
                    error: "RESOURCE_NOT_FOUND"
                }
            })
        }


        await prisma.friendRequest.delete({
            where: {
                id: request.id
            }
        })

        return res.status(200).json({
            success: true,
            message: "Friend request rejected"
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

// get friends list 
export const getFriends = async (req, res) => {
    try {

        // get current userId from jwt token
        const payload = req.payloadData;
        const userId = payload.id;

        const friendship = await prisma.friendship.findMany({
            where: {
                OR: [
                    { user1Id: userId },
                    { user2Id: userId }
                ]
            }
        })

        const friends = await Promise.all(
            friendship.map(async (friendshipId) => {
                const friendsId = friendshipId.user1Id === userId ? friendshipId.user2Id : friendshipId.user1Id;
                return await prisma.user.findUnique({ where: { id: friendsId } })
            })
        )

        return res.status(200).json({
            success: true,
            data: friends
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

// remove friend
export const removeFriend = async (req, res) => {
    try {

        // get userId from jwt token 
        const payload = req.payloadData;
        const userId = payload.id;

        // get friendId from req.body
        const { friendId } = req.body;

        // check if req is not empty 
        if (!friendId) {
            return res.status(400).json({
                success: false,
                error: {
                    message: "Friend Id required",
                    code: "BAD_REQUEST"
                }
            })
        }

        // find the friend in friendship table
        const friend = await prisma.friendship.findFirst({
            where: {
                OR: [
                    { user1Id: userId, user2Id: friendId },
                    { user1Id: friendId, user2Id: userId }
                ]
            }
        })

        // check if friend not found
        if (!friend) {
            return res.status(404).json({
                success: false,
                errro: {
                    message: "Friend not found",
                    code: "RESOURCE_NOT_FOUND"
                }
            })
        }

        // remove friend from friendship table 
        await prisma.friendship.delete({
            where: {
                id: friend.id
            }
        })

        return res.status(200).json({
            success: true,
            message: "Friend removed"
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
