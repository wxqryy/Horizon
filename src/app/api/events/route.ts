import { NextResponse } from 'next/server';
import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite'; 

interface EventFromDb {
    id: number;
    name: string;
    event_date: string;
    time_start: string | null;
    time_end: string | null;
    format: 'online' | 'offline' | 'online_offline';
    description: string | null;
    photo_url: string | null;
    link: string | null;

}

interface TagFromDb {
    id: number;
    name: string;
    color: string | null;
}

export interface EventData {
    id: number;
    name: string;
    event_date: string;
    time_start?: string | null;
    time_end?: string | null;
    format: 'online' | 'offline' | 'online_offline';
    description?: string | null;
    photo_url?: string | null;
    link?: string | null;
    tags: TagFromDb[];
}

const DB_PATH = process.env.DB_PATH || './mydb.sqlite'; 

let dbInstance: Database | null = null;

async function getDb() {
    if (!dbInstance) {
        dbInstance = await open({
            filename: DB_PATH,
            driver: sqlite3.Database
        });
    }
    return dbInstance;
}

export async function GET() { 
    try {
        const db = await getDb();

        const eventsRaw = await db.all<EventFromDb[]>('SELECT * FROM events ORDER BY event_date DESC, time_start ASC');

        const eventsWithTags: EventData[] = [];

        for (const event of eventsRaw) {
            const tags = await db.all<TagFromDb[]>(`
                SELECT t.id, t.name, t.color 
                FROM tags t
                JOIN event_tags et ON t.id = et.tag_id
                WHERE et.event_id = ?
            `, event.id);

            eventsWithTags.push({ 
                id: event.id,
                name: event.name,
                event_date: event.event_date,
                time_start: event.time_start,
                time_end: event.time_end,
                format: event.format,
                description: event.description,
                photo_url: event.photo_url,
                link: event.link,
                tags 
            });
        }

        return NextResponse.json(eventsWithTags, { status: 200 });
    } catch (error) {
        console.error("API Error fetching events:", error);
        return NextResponse.json({ message: 'Ошибка получения мероприятий' }, { status: 500 });
    }
}

