// Credits to Louistiti from Drizzle Discord: https://discord.com/channels/1043890932593987624/1130802621750448160/1143083373535973406
import { drizzle } from "drizzle-orm/postgres-js";
import { sql } from "drizzle-orm";
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL || "";

const pg = postgres(connectionString, { max: 1 });
const db = drizzle(pg);

const clearDb = async (): Promise<void> => {
	try {
		const tablesQuery = sql<string>`DROP SCHEMA public CASCADE; CREATE SCHEMA public;`;
		const tables = await db.execute(tablesQuery);
		console.log(tables);
	} catch (error) {
		console.error("Error to clean database", error);
	} finally {
	}
};

clearDb();
