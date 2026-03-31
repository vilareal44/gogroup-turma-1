import { createDb } from "@chinook/db";

export const db = createDb(process.env.DATABASE_URL!);
