import { setRequestLocale, getTranslations } from 'next-intl/server';
import HomeClient, { type ProductData } from '@/components/home/HomeClient/HomeClient';
import { db } from '@/lib/db';
import JsonLd from '@/components/seo/JsonLd';
import { getBaseUrl } from '@/lib/url';

export const revalidate = 60;

const STORE_SLUG = process.env.STORE_SLUG ?? 'electromarket';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('sampleProducts');

  // Fetch bestsellers and product-of-day from DB
  const store = await db.store.findUniqueOrThrow({ where: { slug: STORE_SLUG } });

  const [hitProducts, podPromotion] = await Promise.all([
    db.product.findMany({
      where: { storeId: store.id, isHit: true, inStock: true },
      orderBy: { reviewCount: 'desc' },
      take: 4,
    }),
    db.promotion.findFirst({
      where: { storeId: store.id, type: 'PRODUCT_OF_DAY', active: true },
    }),
  ]);

  const products: ProductData[] = hitProducts.map((p) => ({
    id: p.id,
    slug: p.slug,
    brand: p.brand ?? '',
    name: t.has(p.nameKey) ? t(p.nameKey) : p.nameKey,
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

  // Fetch product-of-day product
  let podProduct: ProductData | null = null;
  if (podPromotion?.productIds.length) {
    const pod = await db.product.findFirst({
      where: { id: podPromotion.productIds[0], storeId: store.id },
    });
    if (pod) {
      podProduct = {
        id: pod.id,
        slug: pod.slug,
        brand: pod.brand ?? '',
        name: t.has(pod.nameKey) ? t(pod.nameKey) : pod.nameKey,
        image: pod.image ?? '/placeholder-product.svg',
        price: podPromotion.discountPercent
          ? Math.round(pod.price * (1 - podPromotion.discountPercent / 100))
          : pod.price,
        oldPrice: pod.price,
        currency: pod.currency,
        rating: pod.rating,
        reviewCount: pod.reviewCount,
        inStock: pod.inStock,
        isHit: pod.isHit,
        isNew: pod.isNew,
      };
    }
  }

  // Fallback: use first hit product as product-of-day
  const productOfDayBase = podProduct ?? products[0];

  const productOfDay = {
    id: productOfDayBase?.id ?? 'pod',
    brand: productOfDayBase?.brand ?? 'BOSCH',
    name: productOfDayBase?.name ?? 'Product of the Day',
    image: productOfDayBase?.image ?? '/placeholder-product.svg',
    price: productOfDayBase?.price ?? 2490,
    oldPrice: productOfDayBase?.oldPrice ?? productOfDayBase?.price ?? 5499,
    currency: productOfDayBase?.currency ?? 'грн',
    stockLeft: 7,
  };

  const isRestaurant = store.vertical === 'RESTAURANT';
  const baseUrl = getBaseUrl();
  const storeMeta = (store.metadata ?? {}) as Record<string, unknown>;

  const schemaType: Record<string, string> = {
    ECOMMERCE: 'Store',
    FOOD_MARKET: 'GroceryStore',
    RESTAURANT: 'Restaurant',
    B2B: 'Store',
  };

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': schemaType[store.vertical] ?? 'LocalBusiness',
    name: store.name,
    url: `${baseUrl}/${locale}`,
    ...(storeMeta.address ? { address: { '@type': 'PostalAddress', streetAddress: storeMeta.address as string } } : {}),
    ...(storeMeta.phone ? { telephone: storeMeta.phone as string } : {}),
    ...(storeMeta.email ? { email: storeMeta.email as string } : {}),
  };

  // Fetch categories with product count (for MenuCategories section)
  const dbCategories = isRestaurant
    ? await db.category.findMany({
        where: { storeId: store.id },
        include: { _count: { select: { products: true } } },
        orderBy: { sortOrder: 'asc' },
      })
    : [];

  const menuCategories = dbCategories.map((c) => ({
    slug: c.slug,
    nameKey: c.nameKey,
    image: c.image ?? undefined,
    productCount: c._count.products,
  }));

  // Fetch top hit products as daily specials
  const dbSpecials = isRestaurant
    ? await db.product.findMany({
        where: { storeId: store.id, isHit: true, inStock: true },
        orderBy: { rating: 'desc' },
        take: 3,
      })
    : [];

  const BADGE_MAP = ['chef', 'popular', 'new'] as const;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dailySpecials = dbSpecials.map((p, i) => ({
    id: p.id,
    slug: p.slug,
    name: t.has(p.nameKey) ? t(p.nameKey) : p.nameKey,
    description: ((p.metadata as Record<string, unknown> | null)?.description as Record<string, string> | undefined)?.en ?? '',
    price: p.price,
    currency: p.currency,
    image: p.image ?? undefined,
    badge: BADGE_MAP[i],
  }));

  return (
    <>
      <JsonLd data={localBusinessSchema} />
      <HomeClient
        products={products}
        productOfDay={productOfDay}
        storeName={store.name}
        menuCategories={menuCategories.length > 0 ? menuCategories : undefined}
        dailySpecials={dailySpecials.length > 0 ? dailySpecials : undefined}
      />
    </>
  );
}
