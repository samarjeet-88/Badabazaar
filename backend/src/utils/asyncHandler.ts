import type { NextFunction } from "express"

export const asyncHandler=(fn:Function)=>{
    return(req:Request,res:Response,next:NextFunction)=>(
        Promise.resolve(fn).catch(next)    
    )
}