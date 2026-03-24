import { defineConfig } from "drizzle-kit"
import envConfig from "./env.config"
import postgres from "postgres"

console.log(envConfig.db.connectionString)

export default defineConfig({
    schema: "./src/schema/index.ts",
    out: "./src/schema/migrations",
    dialect: "postgresql",
    dbCredentials: {
        url: envConfig.db.connectionString as string
    },
    verbose: true, //tells us what the migration has changed
    strict: true //double check when trying to run migration
})

//This file is just for migrations. It checks the current schema and compare them against the database to generate the valid migration files