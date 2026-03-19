import type { loginDto } from "../validators/auth.validators";
import sendOtpEmail from "../utils/nodeMailer";
import { generateOtp } from "../utils/generateOtp";
import sendOtpSms from "../utils/sendSms";

export class AuthService{
    login=async(data:loginDto)=>{
        const {email,phoneNumber}=data;
        const otp=generateOtp();
        await (email ? sendOtpEmail(email!, otp) : sendOtpSms(phoneNumber!, otp));
        
    }
}