import { Router } from "express";
import type { RequestHandler } from "express";
import { AuthController } from "../controllers/auth.controller";

const authRouter = Router();
const authController = new AuthController();

authRouter.post("/login", authController.login as RequestHandler);
authRouter.post("/register", authController.register as RequestHandler);

export default authRouter;