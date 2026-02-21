import { NextRequest, NextResponse } from 'next/server';
import { listEntries, createEntry } from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') ?? undefined;
  const type = searchParams.get('type') ?? undefined;

  try {
    const entries = listEntries(q, type);
    return NextResponse.json(entries);
  } catch (err) {
    console.error('GET /api/entries error:', err);
    return NextResponse.json({ error: 'Failed to fetch entries' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.date || !body.type) {
      return NextResponse.json({ error: 'date and type are required' }, { status: 400 });
    }
    const entry = createEntry(body);
    return NextResponse.json(entry, { status: 201 });
  } catch (err) {
    console.error('POST /api/entries error:', err);
    return NextResponse.json({ error: 'Failed to create entry' }, { status: 500 });
  }
}
