import { Server } from "socket.io";
import http from "http";
import app from "../app.js";
import { jwtAuthMiddleware } from "../middlewares/jwt.middleware.js";

export const server = http.createServer(app);

export const io = new Server(server, {
    cors: {
        origin: `${process.env.CLIENT_URL} ` || "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
    }
});

const userSocketMap = {}; // { userId -> socketId }

// Get receiver's socket ID
export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
};

io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // Get userId from query sendt from frontned
    const userId = socket.handshake.query.userId;

    if (userId && userId !== "undefined") {
        userSocketMap[userId] = socket.id;
        console.log(`User ${userId} connected with socket ${socket.id}`);

        // send all online online users to frontend.
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }

    socket.on("disconnect", () => {
        console.log(`Socket disconnected: ${socket.id}`);
        if (userId) {
            delete userSocketMap[userId];
            io.emit("getOnlineUsers", Object.keys(userSocketMap));
        }
    });
});