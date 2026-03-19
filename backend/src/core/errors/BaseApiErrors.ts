export class ApiError extends Error{
   statusCode:number;
   constructor(statusCode:number=500,message:string="something went wrong"){
    super(message);
    this.statusCode=statusCode;
   }

   badRequest=(message:string)=>{
    return new ApiError(400,message)
   }

   unauthorized=(message:string)=>{
    return new ApiError(401,message)
   }

   forbidden=(message:string)=>{
    return new ApiError(403,message)
   }
   
   databaseError=(message:string)=>{
    return new ApiError(503,message)
   }

}
