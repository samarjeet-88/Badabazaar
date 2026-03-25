import  {z} from "zod"

export const loginSchema=z.object({
    email:z.email(),
    password:z.string()
})

export const verifyOtpSchema=z.object({
    email:z.email(),
    otp:z.string().length(6)
})

export const registerSchema=z.object({
    email:z.email(),
    password:z.string().min(8,"Password must be atleast 8 characters"),
    firstName:z.string(),
    lastName:z.string()
})

export const verifySchema=z.object({
    userId:z.string(),
    refreshToken:z.string()
})



export type loginDto=z.infer<typeof loginSchema>
export type registerDto=z.infer<typeof registerSchema>
export type verifyOtpDto=z.infer<typeof verifyOtpSchema>
export type verifyDto=z.infer<typeof verifySchema>