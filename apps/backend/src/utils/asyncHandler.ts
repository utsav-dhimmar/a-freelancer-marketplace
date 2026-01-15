import type { Request, Response, NextFunction, RequestHandler } from "express";
import { ApiError } from "@app/shared";

/**
 * Async handler wrapper to eliminate try-catch blocks
 * Catches errors and passes them to error handler or responds directly
 */
const asyncHandler = (requestHandler: RequestHandler): RequestHandler => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await requestHandler(req, res, next);
        } catch (error) {
            if (error instanceof ApiError) {
                res.status(error.statusCode || 500).json({
                    success: false,
                    message: error.message,
                    errors: error.errors,
                });
            } else {
                console.error("[ERROR]", error);
                res.status(500).json({
                    success: false,
                    message: "Internal server error",
                });
            }
        }
    };
};

export default asyncHandler;