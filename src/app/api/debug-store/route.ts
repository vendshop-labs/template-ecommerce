import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// TEMPORARY DEBUG ENDPOINT — DELETE AFTER USE
export async function GET() {
  const stores = await db.$queryRaw<{ slug: string; name: string; vertical: string }[]>`
    SELECT slug, name, vertical FROM "Store" ORDER BY slug
  `;
  return NextResponse.json({ stores, STORE_SLUG: process.env.STORE_SLUG });
}
