import { NextResponse } from 'next/server';

// These API routes now act as simple proxies.
// The actual data is stored in localStorage on the client.
// The client reads/writes directly via the storage module.
// These routes exist only as fallback/compat.

export async function GET() {
  return NextResponse.json({ workouts: [] });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({ workout: body }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
