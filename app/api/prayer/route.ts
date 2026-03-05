// app/api/prayers/route.ts
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const result = await pool.query(
      'SELECT * FROM prayers ORDER BY created_at DESC'
    );
    return NextResponse.json(
      { data: result.rows },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, city, prayer_request, voice_data, voice_duration } = await req.json();

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    if (!prayer_request && !voice_data) {
      return NextResponse.json(
        { error: 'Please provide a prayer request or voice recording' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `INSERT INTO prayers 
        (name, city, prayer_request, voice_data, voice_duration, status) 
       VALUES ($1, $2, $3, $4, $5, 'pending') RETURNING id`,
      [name, city || null, prayer_request || null, voice_data || null, voice_duration || 0]
    );

    return NextResponse.json({ success: true, id: result.rows[0].id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    await pool.query('DELETE FROM prayers WHERE id = $1', [id]);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}