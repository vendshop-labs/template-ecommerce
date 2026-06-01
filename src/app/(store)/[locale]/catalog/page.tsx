import { setRequestLocale, getTranslations } from 'next-intl/server';
import CatalogPage, { type CatalogProduct } from '@/components/catalog/CatalogPage/CatalogPage';
import { db } from '@/lib/db';

const STORE_SLUG = process.env.STORE_SLUG ?? 'electromarket';

export default async function CatalogRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('sampleProducts');
  const store = await db.store.findUniqueOrThrow({ where: { slug: STORE_SLUG } });

  const dbProducts = await db.product.findMany({
    where: { storeId: store.id },
    orderBy: { reviewCount: 'desc' },
    include: { category: true },
  });

  const products: CatalogProduct[] = dbProducts.map((p) => ({
    id: p.id,
    slug: p.slug,
    brand: p.brand ?? '',
    name: t(p.nameKey),
    image: p.image ?? '/placeholder-product.svg',
    price: p.price,
    oldPrice: p.oldPrice ?? undefined,
    currency: p.currency,
    rating: p.rating,
    reviewCount: p.reviewCount,
    inStock: p.inStock,
    isHit: p.isHit,
    isNew: p.isNew,
  }));

  return <CatalogPage products={products} totalFound={products.length} totalPages={Math.ceil(products.length / 9)} />;
}
