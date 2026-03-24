import type { NextFunction, Request, Response } from "express";

export const errorHandler=(err:any,req:Request,res:Response,next:NextFunction)=>{
    const stausCode=err.statusCode|| 500;

    return res.status(stausCode).json({
        success:false,
        message:err.message|| "Internal Server Error"
    })
}