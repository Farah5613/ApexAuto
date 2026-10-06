import { NextResponse } from 'next/server';
import nano from 'nano';

const couchurl = process.env.COUCHDB_URL || 'http://admin:secret123@127.0.0.1:5984';
const couch = (nano as any)(couchurl);
const db = couch.use('cars_db');

export async function GET(request: Request, context: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    const params = await context.params;
    const doc = await db.get(params.id);
    return NextResponse.json(doc);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Not Found" }, { status: 404 });
  }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    const resolvedParams = await context.params;
    const carId = resolvedParams.id;
    const body = await request.json();

    const doc: any = await db.get(carId);
    const response = await db.insert({
      ...doc,
      ...body,
      _id: carId,
      _rev: doc._rev,
    });
    return NextResponse.json({ success: true, car: response });
  } catch (error: any) {
    console.error("PUT Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    const resolvedParams = await context.params;
    const carId = resolvedParams.id;

    if (!carId) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const doc: any = await db.get(carId);
    const response = await db.destroy(carId, doc._rev);
    return NextResponse.json({ success: true, deleted: response });
  } catch (error: any) {
    console.error("Delete Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}