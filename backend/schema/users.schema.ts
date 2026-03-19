import { pgTable,varchar,integer,text,boolean } from "drizzle-orm/pg-core";

export const users=pgTable("users",{
    // change it to correct length here
    id:varchar("id",{length:20}).primaryKey(),
    fullName:varchar("fullName",{length:20}).notNull(),
    email:varchar("email",{length:20}).notNull().unique(),
    phoneNumber:integer("phoneNumber").notNull().unique(),
    imageUrl:text("imageUrl"),
    isActive:boolean('isActive').default(true),
})