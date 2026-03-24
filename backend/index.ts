import express, { urlencoded } from "express"
import "dotenv/config"
import envConfig from "./src/config/env.config"
import logger from "./src/config/log.config"
import { db } from "./src/db"
import cors from "cors"
import cookieParser from "cookie-parser"
import authRouter from "./src/routes/auth.router"
import { errorHandler } from "./src/middlewares/errorMiddleware"
import { sql } from "drizzle-orm"
import swaggerUi from "swagger-ui-express"
import YAML from "yamljs"


const app = express()

app.use(cors())

app.use(express.json())

app.use(urlencoded({ extended: true }))

app.use(cookieParser())

const swaggerDocument = YAML.load('./swagger.yaml')
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use(`${envConfig.url.baseUrl}/auth`, authRouter)

app.use(errorHandler)

const startServer = async () => {
  try {
    logger.info("Database connection started")
    await db.execute(sql`select 1`)
    logger.info("Database connection successful")
    logger.info("Starting express server")
    app.listen(envConfig.port)
    logger.info(`Server started successfully on ${envConfig.port}`)
  } catch (error: any) {
    logger.error({
      message: "Error while starting server",
      error: error
    })
  }
}


startServer()


