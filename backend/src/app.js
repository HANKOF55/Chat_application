// core modules
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

// Local modules
import authRouter from "./routes/auth.route.js";
import chatRouter from "./routes/chat.route.js"
import friendshipRouter from "./routes/friend.route.js";
import userRouter from "./routes/user.route.js";

// configuration
dotenv.config();

const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use(cors({
    origin: `${process.env.CLIENT_URL}` || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
}));

// routes
app.use("/auth", authRouter);
app.use("/friends", friendshipRouter);
app.use("/users", userRouter);
app.use("/chat", chatRouter);

app.get("/api/v1/test", (req, res) => {
    res.send("Welcome to the Chat App API test route!");
});

export default app;
