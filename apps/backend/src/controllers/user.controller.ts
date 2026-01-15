import { ApiError, ApiResponse, HTTP_STATUS } from "@app/shared";
import type { NextFunction, Request, Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import { userService } from "../services/user.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.util.js";


export const register = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  /**
   * --- Flow
   * 1. get inputs
   * 2. apply validation on it
   * 3.
   */
    const { username, fullname, email, password } = req.body;

    // Validate required fields
    if (!username || !fullname || !email || !password) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, "All fields are required (username, fullname, email, password)");
    }

    // Check if email already exists
    if (await userService.emailExists(email)) {
        throw new ApiError(HTTP_STATUS.CONFLICT, "Email already registered");
    }

    // Check if username already exists
    if (await userService.usernameExists(username)) {
        throw new ApiError(HTTP_STATUS.CONFLICT, "Username already taken");
    }

    // Create user
    const user = await userService.createUser({
        username,
        fullname,
        email,
        password,
    });

    // Generate tokens
    const userId = String(user._id);
    const accessToken = generateAccessToken(userId);
    const refreshToken = generateRefreshToken(userId);

    // Save refresh token
    await userService.updateRefreshToken(userId, refreshToken);

    res.status(HTTP_STATUS.CREATED).json(
        new ApiResponse(HTTP_STATUS.CREATED, "User registered successfully", {
            user: {
                id: user._id,
                username: user.username,
                fullname: user.fullname,
                email: user.email,
                createdAt: user.createdAt,
          },
              // temp
            accessToken,
            refreshToken,
        })
    );
});


export const login = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Email and password are required");
    }

    // Find user by email
    const user = await userService.findByEmail(email);
    if (!user) {
        throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid email or password");
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
        throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid email or password");
    }

    // Generate tokens
    const userId = String(user._id);
    const accessToken = generateAccessToken(userId);
    const refreshToken = generateRefreshToken(userId);

    // Save refresh token
    await userService.updateRefreshToken(userId, refreshToken);

  res.status(HTTP_STATUS.OK)
    .cookie("accessToken", accessToken, {
      expires: new Date(Date.now() + 900000)
    })
    .cookie("refreshToken", refreshToken)
    .json(
        new ApiResponse(HTTP_STATUS.OK, "Login successful", {
            user: {
                id: user._id,
                username: user.username,
                fullname: user.fullname,
                email: user.email,
                createdAt: user.createdAt,
          },
          // temp
            accessToken,
            refreshToken,
        })
    );
});


export const me = asyncHandler(async (req: AuthRequest, res: Response, _next: NextFunction) => {
    if (!req.user) {
        throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "User not authenticated");
    }

    res.status(HTTP_STATUS.OK).json(
        new ApiResponse(HTTP_STATUS.OK, "User info retrieved", {
            user: {
                id: req.user._id,
                username: req.user.username,
                fullname: req.user.fullname,
                email: req.user.email,
                createdAt: req.user.createdAt,
                updatedAt: req.user.updatedAt,
            },
        })
    );
});


export const logout = asyncHandler(async (req: AuthRequest, res: Response, _next: NextFunction) => {
    if (!req.user) {
        throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "User not authenticated");
    }

    const userId = String(req.user._id);
    await userService.updateRefreshToken(userId, null);

  res
    .status(HTTP_STATUS.OK)
    .clearCookie("refreshToken")
    .clearCookie("accessToken")
    .json(new ApiResponse(HTTP_STATUS.OK, "Logout successful", null));
});


export const refreshTokenHandler = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Refresh token is required");
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
        throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid or expired refresh token");
    }

    // Find user with this refresh token
    const user = await userService.findByRefreshToken(refreshToken);
    if (!user) {
        throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid refresh token");
    }

    // Generate new access token
    const userId = String(user._id);
    const newAccessToken = generateAccessToken(userId);

  res.status(HTTP_STATUS.OK)
    .cookie("accessToken", newAccessToken,{
      expires: new Date(Date.now() + 900000)
    })
    .cookie("refreshToken", refreshToken)
    .json(
        new ApiResponse(HTTP_STATUS.OK, "Token refreshed successfully", {
            accessToken: newAccessToken,
        })
    );
});
