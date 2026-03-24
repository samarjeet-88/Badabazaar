import logger from "../config/log.config";
import { AuthService } from "../services/auth.service";
import { asyncHandler } from "../utils/asyncHandler";
import { loginSchema, registerSchema, verifyOtpSchema, type loginDto, type registerDto, type verifyOtpDto } from "../validators/auth.validators";
import type { Request, Response } from "express";

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    login = asyncHandler(async (req: Request, res: Response) => {
        const data: loginDto = loginSchema.parse(req.body);
        const result = await this.authService.login(data);
        return res.status(200).json(result);
    });

    register = asyncHandler(async (req: Request, res: Response) => {
        logger.info("Inside register controller")
        const data: registerDto = registerSchema.parse(req.body);
        const result = await this.authService.registerUser(data);
        return res.status(200).json({ success: true, message: "User created successfully" });
    });
}