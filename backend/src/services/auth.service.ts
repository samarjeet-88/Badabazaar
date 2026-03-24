import type { loginDto, registerDto, verifyOtpDto } from "../validators/auth.validators";
import { RedisService } from "../core/redis/RedisService";
import logger from "../config/log.config";
import { ApiError } from "../core/errors/BaseApiErrors";
import { db } from "../db";
import { sql } from "drizzle-orm";
// import { ulid } from "ulid"
import { v7 as uuidv7 } from "uuid"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import envConfig from "../config/env.config";


type UserRow = {
    password: string
};
type JwtPayload={
    userId:string
}

export class AuthService {
    private redis: RedisService
    private apiError: ApiError
    constructor() {
        this.redis = new RedisService()
        this.apiError = new ApiError()
    }


    generateJsonWebToken=(payload:JwtPayload,secretKey:string,expiryTime:number)=>{
        const token=jwt.sign(payload,secretKey,{expiresIn:expiryTime})
        logger.info(`JWT token is ${token} and expiry time is ${expiryTime}`)
        return token;
    }

    checkUserExist = async (email: string): Promise<UserRow | undefined> => {
        const result = await db.execute(sql`SELECT u.password FROM users u WHERE u.email = ${email}`);
        return result.rows[0] as UserRow | undefined;
    }

    // same like register
    // make a logout route=> check for both expiry time and isActive 
    // make a cronjob
    // send in both header and cookie
    login = async (data: loginDto) => {

        const { email, password } = data;
        const user = await this.checkUserExist(email);
        if (!user) {
            return { registered: false, action: "REDIRECT_TO_REGISTER" };
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if (!isPasswordCorrect) {
            throw this.apiError.unauthorized("Invalid email or password")
        }
        return { success: true, message: "User logged in Successfully" };

    }

    registerUser = async (data: registerDto) => {

        logger.info("Inside register service")
        const { email, password, firstName, lastName } = data;
        if (await this.checkUserExist(email)) throw this.apiError.badRequest("User already exists")
        const id = uuidv7();
        const hashedPassword = await bcrypt.hash(password, 10)
        const fullName = `${firstName} ${lastName}`;
        const userResult = await db.execute(sql`INSERT INTO users(id, password, email, "fullName") VALUES (${id}, ${hashedPassword}, ${email}, ${fullName}) RETURNING *`);
        const payload={userId:userResult.rows[0]!.id as string};
        const accessExpireTime=15*60;
        const refreshExpireTime=24*60*60*7;
        const accessToken=this.generateJsonWebToken(payload,envConfig.jwt.accessSecretKey as string,accessExpireTime)
        const refreshToken=this.generateJsonWebToken(payload,envConfig.jwt.refreshSecretKey as string,refreshExpireTime)
        const now=new Date();
        const createdAt=new Date(now.getTime());
        const expiredAt=new Date(now.getTime()+refreshExpireTime*1000);
        const refreshTokenResult=await db.execute(sql`INSERT INTO refreshToken(token,"createdAt","expiredAt","isActive","userId") VALUES (${refreshToken},${createdAt},${expiredAt},"true",${payload.userId})`)
        logger.info("User created successfully")
        return userResult.rows[0];

    }

}