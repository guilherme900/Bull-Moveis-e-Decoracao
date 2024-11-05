import {type SQLiteDatabase} from "expo-sqlite"
export async function initilizeDatabase(database: SQLiteDatabase){
    await database.execAsync(`
        CREATE TABLE IF NOT EXISTS user(
        tokey TEXT PRIMARY KEY,
        use INTEGER NOT NULL,
        name TEXT NOT NULL,
        vendedor INTEGER NOT NULL
        );
    `)
}