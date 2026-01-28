import Database from "better-sqlite3";

export const db = new Database("database.db");

db.prepare(`
  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    createdAt TEXT NOT NULL
  )
`).run();
