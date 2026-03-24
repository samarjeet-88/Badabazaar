import { db } from "../db";
import { sql } from "drizzle-orm";

async function seedRoles() {
    try {
        console.log("Seeding roles...");

        // Use db.execute with raw SQL
        await db.execute(sql`INSERT INTO role(id, "roleName") VALUES (1, 'user'), (2, 'admin') ON CONFLICT DO NOTHING`);

        console.log("Roles seeded successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding roles:");
        console.error(error);
        process.exit(1);
    }
}

seedRoles();
