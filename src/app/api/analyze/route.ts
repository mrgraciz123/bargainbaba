import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'https://bargainbaba-1.onrender.com';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(`${BACKEND_URL}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      let errMsg = 'Backend API error';
      try {
        const errData = await response.json();
        if (errData.error) errMsg = errData.error;
      } catch {}
      return NextResponse.json({ error: errMsg }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('API proxy error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to connect to procurement engine' },
      { status: 500 }
    );
  }
}
