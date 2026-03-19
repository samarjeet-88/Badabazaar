import express, { urlencoded } from "express"
import "dotenv/config"
import envConfig from "./src/config/env.config"
import logger from "./src/config/log.config"
import { db } from "./src/db"
import cors from "cors"
import cookieParser from "cookie-parser"


const app=express()

app.use(cors())

app.use(express.json())

app.use(urlencoded({extended:true}))

app.use(cookieParser())




const startServer=async()=>{
  try{
    logger.info("Database connection started")
    await db.execute("select 1")
    logger.info("Database connection successful")
    logger.info("Starting express server")
    app.listen(envConfig.port)
    logger.info(`Server started successfully on ${envConfig.port}`)
  }catch(error:any){
    logger.error({
      message:"Error while starting server",
      error:error
    })
  } 
}

startServer()


