// src/app/api/auth/token/route.ts
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // Manually handle session and access token extraction for App Router
    const session = await getSession(req);

    if (!session || !session.accessToken) {
      return NextResponse.json({ error: 'Access token not found' }, { status: 401 });
    }

    // Access token found, return it
    return NextResponse.json({ accessToken: session.accessToken });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch access token' }, { status: 500 });
  }
}
