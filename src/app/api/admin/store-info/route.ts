import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { verifyAdminToken, getAdminSecret, ADMIN_COOKIE } from '@/lib/adminAuth';

const STORE_SLUG = process.env.STORE_SLUG ?? 'electromarket';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  const isAdmin = await verifyAdminToken(token, getAdminSecret());
  if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const store = await db.store.findUnique({
    where: { slug: STORE_SLUG },
    select: { name: true, vertical: true },
  });

  return NextResponse.json({ store });
}
