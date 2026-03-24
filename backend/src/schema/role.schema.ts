import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const role = pgTable("role", {
    id: integer("id").primaryKey(),
    roleName: varchar("roleName", { length: 20 }).notNull()
})