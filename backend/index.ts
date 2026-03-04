import "dotenv/config"
import envConfig from "./config/env.config"
import logger from "./config/log.config"
import { db } from "./db"

const startServer=async()=>{
  try{
    logger.info("Database connection started")
    await db.execute("select 1")
    logger.info("Database connection successful")
  }catch(error:any){
    logger.error("Error while starting server",error)
  }
}

startServer()