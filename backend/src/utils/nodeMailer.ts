import nodemailer from "nodemailer"
import envConfig from "../config/env.config"
import path from "path"
import ejs from "ejs"
import logger from "../config/log.config"
import { asyncHandler } from "./asyncHandler"

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: envConfig.email.username,
        pass: envConfig.email.password
    },
    logger: true,
    debug: true
})

async function sendOtpEmail(toEmail: string, otp: string, expireMinutes = 2) {
    logger.info("Starting email send")
    const templatePath = path.join(__dirname, '..', 'views', 'otpEmail.ejs');
    const html = await ejs.renderFile(templatePath, { otp, expireMinutes })
    const info = await transporter.sendMail({
        from: "BadaBazaar",
        to: toEmail,
        subject: "Your OTP Code",
        html
    })
    logger.info("EMAIL OTP SEND SUCCESSFULLY")
}

// sendOtpEmail('samarjeetchoudhary91@gmail.com',"123123")

export default sendOtpEmail
