import { pgTable, varchar, integer, text, boolean, uuid } from "drizzle-orm/pg-core";
import { role } from "./role.schema";

export const users = pgTable("users", {

    id: uuid("id").primaryKey(),
    fullName: varchar("fullName", { length: 20 }).notNull(),
    email: varchar("email", { length: 100 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
    // phoneNumber:integer("phoneNumber").notNull().unique(),
    imageUrl: text("imageUrl"),
    isActive: boolean('isActive').notNull().default(true),
    roleId: integer("roleId").references(() => role.id).notNull().default(1)
})