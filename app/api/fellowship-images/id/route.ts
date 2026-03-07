import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await pool.query(
      'SELECT * FROM fellowship_images WHERE id = $1',
      [id]
    );
    if (!result.rows.length) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }
    return NextResponse.json(
      { data: result.rows[0] },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}