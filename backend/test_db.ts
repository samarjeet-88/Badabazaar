import { db } from "./src/db";
import { sql } from "drizzle-orm";

async function main() {


    try {
        console.log("Trying to insert dummy user...");
        await db.execute(sql`INSERT INTO users(id, password, email, "fullName") VALUES ('019d2130-88a0-742f-abda-f0eea7ca6ce2', 'dummyhash123', 'test@example.com', 'Test User') RETURNING *`);
        console.log("Inserted fine!");
    } catch (e) {
        console.error("Insert error:");
        console.error(e);
    }
    process.exit(0);
}
main();
