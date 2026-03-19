import {Twilio} from "twilio";
import envConfig from "../config/env.config";
import logger from "../config/log.config";


const client=new Twilio(envConfig.twilio.accountSid,envConfig.twilio.authToken)

async function sendOtpSms(phoneNumber:string,otp:string){
    const message=await client.messages.create({
        body:`Your OTP code is ${otp}. It will expire in 2 minutes`,
        from:envConfig.twilio.phoneNumber,
        to:phoneNumber
    })
    logger.info("PHONE OTP SEND SUCCESSFULLY")
    
}

// sendOtpSms('+917499937987','121212')

export default sendOtpSms