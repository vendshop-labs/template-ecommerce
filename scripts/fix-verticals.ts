import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const db = new PrismaClient({ adapter } as never);

async function main() {
  const fixes = [
    { slug: 'electromarket', vertical: 'ECOMMERCE' },
    { slug: 'krajina',       vertical: 'FOOD_MARKET' },
    { slug: 'stepstyle',     vertical: 'SHOE_MARKET' },
  ];

  for (const { slug, vertical } of fixes) {
    await db.$executeRawUnsafe(
      `UPDATE "Store" SET vertical = $1::"Vertical" WHERE slug = $2`,
      vertical, slug
    );
    console.log(`✅ ${slug} → ${vertical}`);
  }

  const stores = await db.$queryRaw<{ slug: string; vertical: string }[]>`
    SELECT slug, vertical FROM "Store" ORDER BY slug
  `;
  console.log('\nCurrent state:');
  stores.forEach(s => console.log(`  ${s.slug}: ${s.vertical}`));
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await db.$disconnect(); await pool.end(); });
