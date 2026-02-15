// core modules
import express from "express";

// local modules
import { sendFriendRequest, getPendingRequests, acceptFriendRequest, rejectFriendRequest, getFriends, removeFriend } from "../controllers/friend.controller.js";
import { jwtAuthMiddleware } from "../middlewares/jwt.middleware.js";

// router instance
const friendshipRouter = express.Router();

// routes
friendshipRouter.post("/", jwtAuthMiddleware, sendFriendRequest);
friendshipRouter.post("/sendRequest", jwtAuthMiddleware, sendFriendRequest);
friendshipRouter.get("/myrequests", jwtAuthMiddleware, getPendingRequests);
friendshipRouter.post("/accept", jwtAuthMiddleware, acceptFriendRequest);
friendshipRouter.post("/reject", jwtAuthMiddleware, rejectFriendRequest);
friendshipRouter.get("/myfriends", jwtAuthMiddleware, getFriends);


export default friendshipRouter;