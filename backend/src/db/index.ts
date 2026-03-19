import {drizzle} from "drizzle-orm/node-postgres"
import {Pool} from "pg"
import envConfig from "../config/env.config"
import * as schema from "../schema/index"


const pool=new Pool({
    connectionString:envConfig.db.connectionString,
    min:5,
    max:15,
    idleTimeoutMillis:30000,
    connectionTimeoutMillis:10000
})
export const db=drizzle(pool,{schema})
// add the schema here