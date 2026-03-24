import { pgTable, text, boolean, uuid, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users.schema";

export const refreshToken = pgTable("refreshToken", {
    token:text("token"),
    createdAt:timestamp("createdAt",{withTimezone:true,mode:"date"}).notNull(),
    expiredAt:timestamp("createdAt",{withTimezone:true,mode:"date"}).notNull(),
    isActive:boolean("isActive").notNull().default(true),
    userId: uuid("userId").references(() => users.id).notNull()
})