import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const question_id = searchParams.get('question_id');

    const result = await pool.query(
      'SELECT * FROM answers WHERE question_id = $1 ORDER BY created_at DESC',
      [question_id]
    );
    return NextResponse.json({ data: result.rows });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { question_id, answered_by, content } = await req.json();

    if (!question_id || !answered_by || !content) {
      return NextResponse.json(
        { error: 'question_id, answered_by and content are required' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      'INSERT INTO answers (question_id, answered_by, content) VALUES ($1, $2, $3) RETURNING id',
      [question_id, answered_by, content]
    );

    return NextResponse.json({ success: true, id: result.rows[0].id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    await pool.query('DELETE FROM answers WHERE id = $1', [id]);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}