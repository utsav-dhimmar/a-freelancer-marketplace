import { APP_NAME } from "@app/shared";
import express from "express";
import cors from "cors";

import userRoutes from "./routes/user.routes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
    return res.json({
        message: "Welcome to the Freelancer Marketplace API",
        name: APP_NAME,
    });
});

// API Routes
app.use("/api/users", userRoutes);


export default app;



