import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// IMPORT SEMUA SCHEMA DI SINI
import * as schema from "./schema"; 

const sql = neon(process.env.DATABASE_URL!);

// MASUKKAN OBJECT SCHEMA KE DALAM CONFIG DRIZZLE
// Tanpa ini, db.query tidak akan berfungsi (undefined)
export const db = drizzle(sql, { schema });