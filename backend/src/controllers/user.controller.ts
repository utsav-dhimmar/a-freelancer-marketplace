import type { NextFunction, Request, Response } from "express";
import { HTTP_STATUS } from "../constants/index.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import { userService } from "../services/user.service.js";
import { ApiError, ApiResponse } from "../utils/ApiHelper.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
} from "../utils/jwt.util.js";

/**
 * POST /api/users/register
 * Register a new user
 */
export const register = asyncHandler(
	async (req: Request, res: Response, _next: NextFunction) => {
		const { username, fullname, email, password, role } = req.body;

		// Validate required fields
		if (!username || !fullname || !email || !password) {
			throw new ApiError(
				HTTP_STATUS.BAD_REQUEST,
				"All fields are required (username, fullname, email, password)",
			);
		}

		// Validate role if provided
		const validRoles = ["client", "admin", "freelancer"];
		const userRole = role || "client";
		if (!validRoles.includes(userRole)) {
			throw new ApiError(
				HTTP_STATUS.BAD_REQUEST,
				"Invalid role. Must be client, admin, or freelancer",
			);
		}

		// Check if email already exists
		if (await userService.emailExists(email)) {
			throw new ApiError(
				HTTP_STATUS.CONFLICT,
				"Email already registered",
			);
		}

		// Check if username already exists
		if (await userService.usernameExists(username)) {
			throw new ApiError(HTTP_STATUS.CONFLICT, "Username already taken");
		}

		// Create user with role
		const user = await userService.createUser({
			username,
			fullname,
			email,
			password,
			role: userRole,
		});

		// Generate tokens
		const userId = String(user._id);
		const accessToken = generateAccessToken(userId);
		const refreshToken = generateRefreshToken(userId);

		// Save refresh token
		await userService.updateRefreshToken(userId, refreshToken);

		res.status(HTTP_STATUS.CREATED).json(
			new ApiResponse(
				HTTP_STATUS.CREATED,
				"User registered successfully",
				{
					user: {
						id: user._id,
						username: user.username,
						fullname: user.fullname,
						email: user.email,
						role: user.role,
						createdAt: user.createdAt,
					},
					accessToken,
					refreshToken,
				},
			),
		);
	},
);

/**
 * POST /api/users/login
 * Authenticate user and return tokens
 */
export const login = asyncHandler(
	async (req: Request, res: Response, _next: NextFunction) => {
		const { email, password } = req.body;

		// Validate required fields
		if (!email || !password) {
			throw new ApiError(
				HTTP_STATUS.BAD_REQUEST,
				"Email and password are required",
			);
		}

		// Find user by email
		const user = await userService.findByEmail(email);
		if (!user) {
			throw new ApiError(
				HTTP_STATUS.UNAUTHORIZED,
				"Invalid email or password",
			);
		}

		// Verify password
		const isPasswordValid = await user.comparePassword(password);
		if (!isPasswordValid) {
			throw new ApiError(
				HTTP_STATUS.UNAUTHORIZED,
				"Invalid email or password",
			);
		}

		// Generate tokens
		const userId = String(user._id);
		const accessToken = generateAccessToken(userId);
		const refreshToken = generateRefreshToken(userId);

		// Save refresh token
		await userService.updateRefreshToken(userId, refreshToken);

		res.status(HTTP_STATUS.OK)
			.cookie("accessToken", accessToken, {
				expires: new Date(Date.now() + 900000),
			})
			.cookie("refreshToken", refreshToken)
			.json(
				new ApiResponse(HTTP_STATUS.OK, "Login successful", {
					user: {
						id: user._id,
						username: user.username,
						fullname: user.fullname,
						email: user.email,
						role: user.role,
						createdAt: user.createdAt,
					},
					accessToken,
					refreshToken,
				}),
			);
	},
);

/**
 * GET /api/users/me
 * Get current authenticated user info
 */
export const me = asyncHandler(
	async (req: AuthRequest, res: Response, _next: NextFunction) => {
		if (!req.user) {
			throw new ApiError(
				HTTP_STATUS.UNAUTHORIZED,
				"User not authenticated",
			);
		}

		res.status(HTTP_STATUS.OK).json(
			new ApiResponse(HTTP_STATUS.OK, "User info retrieved", {
				user: {
					id: req.user._id,
					username: req.user.username,
					fullname: req.user.fullname,
					email: req.user.email,
					role: req.user.role,
					createdAt: req.user.createdAt,
					updatedAt: req.user.updatedAt,
				},
			}),
		);
	},
);

/**
 * POST /api/users/logout
 * Clear refresh token and logout user
 */
export const logout = asyncHandler(
	async (req: AuthRequest, res: Response, _next: NextFunction) => {
		if (!req.user) {
			throw new ApiError(
				HTTP_STATUS.UNAUTHORIZED,
				"User not authenticated",
			);
		}

		const userId = String(req.user._id);
		await userService.updateRefreshToken(userId, null);

		res.status(HTTP_STATUS.OK)
			.clearCookie("refreshToken")
			.clearCookie("accessToken")
			.json(new ApiResponse(HTTP_STATUS.OK, "Logout successful", null));
	},
);

/**
 * POST /api/users/refresh-token
 * Generate new access token using refresh token
 */
export const refreshTokenHandler = asyncHandler(
	async (req: Request, res: Response, _next: NextFunction) => {
		const { refreshToken } = req.body;

		if (!refreshToken) {
			throw new ApiError(
				HTTP_STATUS.BAD_REQUEST,
				"Refresh token is required",
			);
		}

		// Verify refresh token
		const decoded = verifyRefreshToken(refreshToken);
		if (!decoded) {
			throw new ApiError(
				HTTP_STATUS.UNAUTHORIZED,
				"Invalid or expired refresh token",
			);
		}

		// Find user with this refresh token
		const user = await userService.findByRefreshToken(refreshToken);
		if (!user) {
			throw new ApiError(
				HTTP_STATUS.UNAUTHORIZED,
				"Invalid refresh token",
			);
		}

		// Generate new access token
		const userId = String(user._id);
		const newAccessToken = generateAccessToken(userId);

		res.status(HTTP_STATUS.OK)
			.cookie("accessToken", newAccessToken, {
				expires: new Date(Date.now() + 900000),
			})
			.cookie("refreshToken", refreshToken)
			.json(
				new ApiResponse(
					HTTP_STATUS.OK,
					"Token refreshed successfully",
					{
						accessToken: newAccessToken,
					},
				),
			);
	},
);
