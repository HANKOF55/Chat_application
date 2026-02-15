// core modules
import express, { Router } from "express";

// Local modules
import { registerUser, loginUser, logoutUser, getCurrentUser } from "../controllers/auth.controller.js";
import { jwtAuthMiddleware } from "../middlewares/jwt.middleware.js";

// router instance
const authRouter = express.Router();

// Routes
authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/logout", jwtAuthMiddleware, logoutUser);
authRouter.get("/me", jwtAuthMiddleware, getCurrentUser);

export default authRouter;