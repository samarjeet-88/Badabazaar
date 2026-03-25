import logger from "../config/log.config";
import { AuthService } from "../services/auth.service";
import { asyncHandler } from "../utils/asyncHandler";
import { loginSchema, registerSchema, verifyOtpSchema, verifySchema, type loginDto, type registerDto, type verifyDto, type verifyOtpDto } from "../validators/auth.validators";
import type { Request, Response } from "express";

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    private setAuthCookies = (res: Response, accessToken: string, refreshToken: string) => {
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            sameSite: "strict",
            expires: new Date(new Date().getTime() + 15 * 60 * 1000),
            secure: true
        });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "strict",
            expires: new Date(new Date().getTime() + 24 * 60 * 60 * 7 * 1000),
            // secure:true
        });
    }

    login = asyncHandler(async (req: Request, res: Response) => {
        logger.info("Inside login controller")
        const data: loginDto = loginSchema.parse(req.body);

        const { accessToken, refreshToken } = await this.authService.login(data);
        this.setAuthCookies(res, accessToken!, refreshToken!);

        return res.status(200).json({ sucess: true, message: "User logged in successfully" });
    });

    register = asyncHandler(async (req: Request, res: Response) => {
        logger.info("Inside register controller")
        const data: registerDto = registerSchema.parse(req.body);

        const { accessToken, refreshToken } = await this.authService.registerUser(data);
        this.setAuthCookies(res, accessToken!, refreshToken!);

        return res.status(200).json({ success: true, message: "User created successfully" });
    });

    refresh = asyncHandler(async (req: Request, res: Response) => {
        logger.info("Inside refresh controller")

        const userId = req.body.userId;
        const token = req.cookies.refreshToken;
        const data: verifyDto = verifySchema.parse({ userId, refreshToken: token })

        const { accessToken, refreshToken } = await this.authService.refreshToken(data);
        this.setAuthCookies(res, accessToken!, refreshToken!);

        return res.status(200).json({ success: true, message: "User refresh and access token rotated successfully" });

    })
}