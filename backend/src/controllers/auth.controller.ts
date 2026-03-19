import { AuthService } from "../services/auth.service";
import { asyncHandler } from "../utils/asyncHandler";
import { loginSchema, type loginDto } from "../validators/auth.validators";

class AuthController{
    private authService:AuthService
    constructor(){
        this.authService=new AuthService()
    }
    login=asyncHandler((req:Request,res:Response)=>{
        const data:loginDto=loginSchema.parse(req.body);
        
        
    })
}