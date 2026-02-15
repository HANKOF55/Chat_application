import express from 'express';
import { getChatHistory, sendMessage } from '../controllers/chat.controller.js';
import { jwtAuthMiddleware } from "../middlewares/jwt.middleware.js";

const chatRouter = express.Router();


chatRouter.get('/history/:friendId', jwtAuthMiddleware, getChatHistory);
chatRouter.post("/sendmessage/:id", jwtAuthMiddleware, sendMessage);

export default chatRouter;