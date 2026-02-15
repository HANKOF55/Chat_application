// core module
import express from "express";

// local module
import { getAllUsers } from "../controllers/users.controller.js";
import { jwtAuthMiddleware } from "../middlewares/jwt.middleware.js";

// router instance
const userRouter = express.Router();

// rotues
userRouter.get("/", jwtAuthMiddleware, getAllUsers);


export default userRouter;