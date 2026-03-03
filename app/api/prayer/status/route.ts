import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function PATCH(req: NextRequest) {
  try {
    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json(
        { error: 'id and status are required' },
        { status: 400 }
      );
    }

    if (!['pending', 'completed'].includes(status)) {
      return NextResponse.json(
        { error: 'status must be pending or completed' },
        { status: 400 }
      );
    }

    await pool.query(
      'UPDATE prayers SET status = ? WHERE id = ?',
      [status, id]
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}