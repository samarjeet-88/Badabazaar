import  {z} from "zod"

export const loginSchema=z.object({
    email:z.email().optional(),
    phoneNumber:z.string().length(10).optional()
}).refine((data)=>{
    return(
        (data.email || !data.phoneNumber) && (!data.email || data.phoneNumber) 
    )
},{message:"Provider either email or phoneNumber, not both"})  



export type loginDto=z.infer<typeof loginSchema>