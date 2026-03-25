import { pgTable, text, boolean, uuid, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users.schema";

export const refreshToken = pgTable("refresh_token", {
    token: text("token").notNull(),
    createdAt: timestamp("createdAt", { withTimezone: true, mode: "date" }).notNull(),
    expiredAt: timestamp("expiredAt", { withTimezone: true, mode: "date" }).notNull(),
    isActive: boolean("isActive").notNull().default(true),
    userId: uuid("userId")
        .primaryKey()
        .references(() => users.id)
        .notNull()
});