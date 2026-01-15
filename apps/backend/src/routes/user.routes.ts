import { Router } from "express";
import { login, logout, me, refreshTokenHandler, register } from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();


router.post("/register", register);

router.post("/login", login);

router.get("/me", authMiddleware, me);

router.post("/logout", authMiddleware, logout);

router.post("/refresh-token", refreshTokenHandler);

export default router;
