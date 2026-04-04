import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM prayers ORDER BY created_at DESC'
    );
    return NextResponse.json({ data: rows });
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

    const [result]: any = await pool.query(
      `INSERT INTO prayers 
        (name, city, prayer_request, voice_data, voice_duration, status) 
       VALUES (?, ?, ?, ?, ?, 'pending')`,
      [name, city || null, prayer_request || null, voice_data || null, voice_duration || 0]
    );

    return NextResponse.json({ success: true, id: result.insertId });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    await pool.query('DELETE FROM prayers WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}