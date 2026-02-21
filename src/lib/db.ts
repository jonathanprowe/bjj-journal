import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import fs from 'fs';

const DB_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DB_DIR, 'journal.db');

let _db: DatabaseSync | null = null;

function getDb(): DatabaseSync {
  if (_db) return _db;

  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  _db = new DatabaseSync(DB_PATH);

  _db.exec(`PRAGMA journal_mode = WAL`);
  _db.exec(`PRAGMA foreign_keys = ON`);

  _db.exec(`
    CREATE TABLE IF NOT EXISTS entries (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      date            TEXT NOT NULL,
      created_at      TEXT NOT NULL,
      updated_at      TEXT NOT NULL,
      type            TEXT NOT NULL,
      duration        INTEGER,
      location        TEXT,
      partner         TEXT,
      instructor      TEXT,
      techniques      TEXT,
      what_went_well  TEXT,
      what_to_improve TEXT,
      notes           TEXT,
      rating          INTEGER
    )
  `);

  return _db;
}

export type EntryType = 'gi' | 'nogi' | 'openmat' | 'competition' | 'drilling';

export interface Entry {
  id: number;
  date: string;
  created_at: string;
  updated_at: string;
  type: EntryType;
  duration: number | null;
  location: string | null;
  partner: string | null;
  instructor: string | null;
  techniques: string | null;
  what_went_well: string | null;
  what_to_improve: string | null;
  notes: string | null;
  rating: number | null;
}

export interface EntryInput {
  date: string;
  type: EntryType;
  duration?: number | null;
  location?: string | null;
  partner?: string | null;
  instructor?: string | null;
  techniques?: string | null;
  what_went_well?: string | null;
  what_to_improve?: string | null;
  notes?: string | null;
  rating?: number | null;
}

export function listEntries(q?: string, type?: string): Entry[] {
  const db = getDb();
  let sql = 'SELECT * FROM entries';
  const params: string[] = [];
  const conditions: string[] = [];

  if (q) {
    conditions.push(
      `(techniques LIKE ? OR what_went_well LIKE ? OR what_to_improve LIKE ? OR notes LIKE ? OR location LIKE ? OR partner LIKE ? OR instructor LIKE ?)`
    );
    const like = `%${q}%`;
    params.push(like, like, like, like, like, like, like);
  }

  if (type) {
    conditions.push(`type = ?`);
    params.push(type);
  }

  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }

  sql += ' ORDER BY date DESC, created_at DESC';

  return (db.prepare(sql).all(...params) as object[]).map((r) => Object.assign({}, r) as Entry);
}

export function getEntry(id: number): Entry | undefined {
  const db = getDb();
  const row = db.prepare('SELECT * FROM entries WHERE id = ?').get(id);
  return row ? (Object.assign({}, row) as Entry) : undefined;
}

export function createEntry(input: EntryInput): Entry {
  const db = getDb();
  const now = new Date().toISOString();

  const result = db.prepare(`
    INSERT INTO entries (date, created_at, updated_at, type, duration, location, partner, instructor, techniques, what_went_well, what_to_improve, notes, rating)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    input.date,
    now,
    now,
    input.type,
    input.duration ?? null,
    input.location ?? null,
    input.partner ?? null,
    input.instructor ?? null,
    input.techniques ?? null,
    input.what_went_well ?? null,
    input.what_to_improve ?? null,
    input.notes ?? null,
    input.rating ?? null,
  );

  return getEntry(Number(result.lastInsertRowid))!;
}

export function updateEntry(id: number, input: Partial<EntryInput>): Entry | undefined {
  const db = getDb();
  const existing = getEntry(id);
  if (!existing) return undefined;

  const now = new Date().toISOString();
  const merged = { ...existing, ...input };

  db.prepare(`
    UPDATE entries SET
      date            = ?,
      updated_at      = ?,
      type            = ?,
      duration        = ?,
      location        = ?,
      partner         = ?,
      instructor      = ?,
      techniques      = ?,
      what_went_well  = ?,
      what_to_improve = ?,
      notes           = ?,
      rating          = ?
    WHERE id = ?
  `).run(
    merged.date,
    now,
    merged.type,
    merged.duration ?? null,
    merged.location ?? null,
    merged.partner ?? null,
    merged.instructor ?? null,
    merged.techniques ?? null,
    merged.what_went_well ?? null,
    merged.what_to_improve ?? null,
    merged.notes ?? null,
    merged.rating ?? null,
    id,
  );

  return getEntry(id);
}

export function deleteEntry(id: number): boolean {
  const db = getDb();
  const result = db.prepare('DELETE FROM entries WHERE id = ?').run(id);
  return result.changes > 0;
}

export function getStats(): {
  total: number;
  thisMonth: number;
  avgRating: number | null;
  streak: number;
} {
  const db = getDb();

  const total = (db.prepare('SELECT COUNT(*) as c FROM entries').get() as { c: number }).c;

  const now = new Date();
  const monthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const thisMonth = (
    db.prepare("SELECT COUNT(*) as c FROM entries WHERE date LIKE ?").get(`${monthStr}%`) as { c: number }
  ).c;

  const avgRow = db.prepare(
    'SELECT AVG(rating) as avg FROM entries WHERE rating IS NOT NULL'
  ).get() as { avg: number | null };
  const avgRating = avgRow.avg != null ? Math.round(avgRow.avg * 10) / 10 : null;

  // Streak: count consecutive days with at least one entry ending today
  const dates = (
    db.prepare('SELECT DISTINCT date FROM entries ORDER BY date DESC').all() as { date: string }[]
  ).map((r) => r.date);

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < dates.length; i++) {
    const entryDate = new Date(dates[i]);
    entryDate.setHours(0, 0, 0, 0);
    const expected = new Date(today);
    expected.setDate(today.getDate() - i);
    if (entryDate.getTime() === expected.getTime()) {
      streak++;
    } else {
      break;
    }
  }

  return { total, thisMonth, avgRating, streak };
}
