import type { loginDto, registerDto, verifyDto, verifyOtpDto } from "../validators/auth.validators";
import { RedisService } from "../core/redis/RedisService";
import logger from "../config/log.config";
import { ApiError } from "../core/errors/BaseApiErrors";
import { db } from "../db";
import { sql } from "drizzle-orm";
import { v7 as uuidv7 } from "uuid"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import envConfig from "../config/env.config";


type UserRow = {
    id: string,
    password: string
};
type JwtPayload = {
    userId: string
}

export class AuthService {
    private redis: RedisService
    private apiError: ApiError
    constructor() {
        this.redis = new RedisService()
        this.apiError = new ApiError()
    }

    generateJsonWebToken = (payload: JwtPayload, secretKey: string, expiryTime: number): string => {
        const token = jwt.sign(payload, secretKey, { expiresIn: expiryTime })
        return token;
    }

    generateAccessToken = (payload: JwtPayload): string => {
        const accessExpireTime = 15 * 60;
        return this.generateJsonWebToken(payload, envConfig.jwt.accessSecretKey as string, accessExpireTime);
    }

    generateRefreshToken = (payload: JwtPayload): string => {
        const refreshExpireTime = 24 * 60 * 60 * 7;
        return this.generateJsonWebToken(payload, envConfig.jwt.refreshSecretKey as string, refreshExpireTime);
    }

    private generateAndSaveTokens = async (userId: string, tx: any = db) => {
        const payload = { userId };
        const accessToken = this.generateAccessToken(payload);
        const refreshToken = this.generateRefreshToken(payload);

        const now = new Date();
        const createdAt = now.toISOString();
        const expiredAt = new Date(now.getTime() + 24 * 60 * 60 * 7 * 1000).toISOString();

        await tx.execute(sql`INSERT INTO refresh_token(token, "createdAt", "expiredAt", "isActive", "userId") VALUES (${refreshToken}, ${createdAt}, ${expiredAt}, true, ${userId}) ON CONFLICT ("userId") DO UPDATE SET "token" = ${refreshToken}, "createdAt" = ${createdAt},"expiredAt" = ${expiredAt}, "isActive" = true`);

        return { accessToken, refreshToken };
    }

    checkUserExist = async (email: string): Promise<UserRow | undefined> => {
        const result = await db.execute(sql`SELECT u.id as id, u.password as password FROM users u WHERE u.email = ${email}`);
        return result.rows[0] as UserRow | undefined;
    }

    login = async (data: loginDto) => {
        const { email, password } = data;

        const user = await this.checkUserExist(email);
        if (!user) {
            throw this.apiError.notFound("REDIRECT_TO_REGISTER")
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if (!isPasswordCorrect) {
            throw this.apiError.unauthorized("Invalid email or password")
        }

        const { accessToken, refreshToken } = await this.generateAndSaveTokens(user.id);
        return { accessToken, refreshToken };
    }

    registerUser = async (data: registerDto) => {
        const { email, password, firstName, lastName } = data;

        const user = await this.checkUserExist(email);
        if (user) {
            throw this.apiError.badRequest("User already exists");
        }

        const id = uuidv7();
        const hashedPassword = await bcrypt.hash(password, 10);
        const fullName = `${firstName} ${lastName}`;

        const payload = { userId: id };
        const accessToken = this.generateAccessToken(payload);
        const refreshToken = this.generateRefreshToken(payload);

        const now = new Date();
        const createdAt = now.toISOString();
        const expiredAt = new Date(now.getTime() + 24 * 60 * 60 * 7 * 1000).toISOString();

        await db.transaction(async (tx) => {
            await tx.execute(sql`INSERT INTO users(id, password, email, "fullName") VALUES (${id}, ${hashedPassword}, ${email}, ${fullName})`);
            await tx.execute(sql`INSERT INTO refresh_token(token, "createdAt", "expiredAt", "isActive", "userId") VALUES (${refreshToken}, ${createdAt}, ${expiredAt}, true, ${id}) ON CONFLICT ("userId") DO UPDATE SET "token" = ${refreshToken}, "createdAt" = ${createdAt},"expiredAt" = ${expiredAt}, "isActive" = true`);
        });

        return { accessToken, refreshToken };
    }

    refreshToken = async (data: verifyDto) => {
        const result = await db.execute(sql`SELECT token FROM refresh_token WHERE "userId" = ${data.userId}`)
        if (data.refreshToken !== result.rows[0]!.token) {
            throw this.apiError.unauthorized("User not authorized")
        }
        const { accessToken, refreshToken } = await this.generateAndSaveTokens(data.userId);
        return { accessToken, refreshToken };
    }
}