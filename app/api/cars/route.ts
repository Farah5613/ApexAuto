import { NextResponse } from 'next/server';
import nano from 'nano';

const couchurl = process.env.COUCHDB_URL || 'http://admin:secret123@127.0.0.1:5984';
const couch = (nano as any)(couchurl);
const db = couch.use('cars_db');

export async function GET() {
  try {
    const data = await db.list({ include_docs: true });
    const cars = data.rows
      .filter((row: any) => !row.id.startsWith('_design/'))
      .map((row: any) => row.doc);
    return NextResponse.json(cars);
  } catch (error: any) {
    console.error("Couchdb Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const response = await db.insert({
      _id: Date.now().toString(),
      ...body,
    });
    return NextResponse.json({ success: true, car: response });
  } catch (error: any) {
    console.error("Couchdb Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}