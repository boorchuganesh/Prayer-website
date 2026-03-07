// app/api/fellowship-images/route.ts
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const result = await pool.query(
      'SELECT id, title, location, file_data, file_type, file_size, file_name, created_at FROM fellowship_images ORDER BY created_at DESC'
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
    const { title, location, file_data, file_name, file_type, file_size } = await req.json();
    if (!title) return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    if (!file_data) return NextResponse.json({ error: 'Image is required' }, { status: 400 });

    const result = await pool.query(
      `INSERT INTO fellowship_images (title, location, file_data, file_name, file_type, file_size)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [title, location || null, file_data, file_name, file_type, file_size]
    );
    return NextResponse.json({ success: true, id: result.rows[0].id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    await pool.query('DELETE FROM fellowship_images WHERE id = $1', [id]);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}