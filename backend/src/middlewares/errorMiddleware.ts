import type { NextFunction, Request, Response } from "express";
import logger from "../config/log.config";

const PG_UNIQUE_VIOLATION = "23505";
const PG_FK_VIOLATION = "23503";
const PG_NOT_NULL_VIOLATION = "23502";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    logger.error(err);

    // Drizzle wraps pg errors inside err.cause
    const pgCode = err?.cause?.code;

    if (pgCode === PG_UNIQUE_VIOLATION) {
        return res.status(409).json({ success: false, message: "Resource already exists" });
    }
    if (pgCode === PG_FK_VIOLATION) {
        return res.status(400).json({ success: false, message: "Referenced resource not found" });
    }
    if (pgCode === PG_NOT_NULL_VIOLATION) {
        return res.status(400).json({ success: false, message: "Missing required field" });
    }

    const statusCode = err.statusCode || 500;
    return res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
}