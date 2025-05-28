import 'server-only';
import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

let dbInstance: Database | null = null;

export const XP_THRESHOLDS_FOR_LEVEL: number[] = [
  0,
  250,
  500,
  750,
  1000,

];

export async function getDb(): Promise<Database> {
  if (!dbInstance) {
    console.log("INFO: Initializing database connection and schema...");
    dbInstance = await open({
      filename: process.env.DATABASE_URL || './mydb.sqlite', 
      driver: sqlite3.Database,
    });

    await dbInstance.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        is_verified BOOLEAN DEFAULT FALSE,
        verification_code TEXT,
        verification_code_sent_at DATETIME,
        password_reset_token TEXT,
        password_reset_token_sent_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const tableInfoUsers = await dbInstance.all("PRAGMA table_info(users);");
    const columnNamesUsers = tableInfoUsers.map(col => col.name as string); 

    const columnsToAddInUsers = [ 
      { name: 'avatar_url', type: 'TEXT', default: "NULL" },
      { name: 'profile_name', type: 'TEXT', default: "NULL" },
      { name: 'profile_completed_steps', type: 'INTEGER', default: 0 },
      { name: 'profile_total_steps', type: 'INTEGER', default: 5 },
      { name: 'current_xp', type: 'INTEGER', default: 0 },
      { name: 'current_level_index', type: 'INTEGER', default: 0 }
    ];

    for (const col of columnsToAddInUsers) {
      if (!columnNamesUsers.includes(col.name)) {
        console.log(`INFO: Adding column ${col.name} to users table...`);
        await dbInstance.exec(`ALTER TABLE users ADD COLUMN ${col.name} ${col.type} DEFAULT ${col.default};`);
      }
    }

    await dbInstance.exec(`
      CREATE TABLE IF NOT EXISTS events (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          event_date TEXT NOT NULL,
          time_start TEXT,
          time_end TEXT,
          format TEXT CHECK(format IN ('online', 'offline', 'online_offline')) NOT NULL,
          description TEXT,
          photo_url TEXT,
          link TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await dbInstance.exec(`
      CREATE TABLE IF NOT EXISTS tags (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL UNIQUE,
          color TEXT -- Например, #RRGGBB
      );
    `);

    await dbInstance.exec(`
      CREATE TABLE IF NOT EXISTS event_tags (
          event_id INTEGER NOT NULL,
          tag_id INTEGER NOT NULL,
          PRIMARY KEY (event_id, tag_id),
          FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
          FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
      );
    `);

    const triggerExists = await dbInstance.get("SELECT name FROM sqlite_master WHERE type='trigger' AND name='update_events_updated_at';");
    if (!triggerExists) {
        console.log("INFO: Creating trigger update_events_updated_at...");
        await dbInstance.exec(`
            CREATE TRIGGER update_events_updated_at
            AFTER UPDATE ON events
            FOR EACH ROW
            BEGIN
                UPDATE events SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
            END;
        `);
    }
    console.log("INFO: Database initialization and schema check complete.");
  }
  return dbInstance;
}