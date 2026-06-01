import { setRequestLocale, getTranslations } from 'next-intl/server';
import HomeClient, { type ProductData } from '@/components/home/HomeClient/HomeClient';
import { db } from '@/lib/db';

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
        name: t(pod.nameKey),
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

  return <HomeClient products={products} productOfDay={productOfDay} />;
}
