'use client';

import CategoriesGrid from '@/components/home/CategoriesGrid/CategoriesGrid';
import BestSellers from '@/components/home/BestSellers/BestSellers';
import ProductOfDay from '@/components/home/ProductOfDay/ProductOfDay';
import BrandsSection from '@/components/home/BrandsSection/BrandsSection';
import TrustStrip from '@/components/home/TrustStrip/TrustStrip';
import SubscribeBanner from '@/components/home/SubscribeBanner/SubscribeBanner';
import PopularTags from '@/components/home/PopularTags/PopularTags';
import type { ProductCardProps } from '@/components/catalog/ProductCard/ProductCard';
import type { ProductOfDayProps } from '@/components/home/ProductOfDay/ProductOfDay';
import styles from './HomeClient.module.css';

// ProductOfDay without endsAt — we compute it client-side to avoid serialization issues
type ProductOfDayData = Omit<ProductOfDayProps['product'], 'endsAt'>;

export type ProductData = Omit<ProductCardProps, 'onAddToCart' | 'onCompare' | 'onFavorite'>;

interface HomeClientProps {
  products: ProductData[];
  productOfDay: ProductOfDayData;
}

// Module-level constant: countdown target is fixed for the session duration.
const ENDS_AT = new Date(Date.now() + ((2 * 24 + 14) * 3600 + 37 * 60 + 22) * 1000);

const noop = (_id: string) => {};
const noopStr = (_s: string) => {};

export default function HomeClient({ products, productOfDay }: HomeClientProps) {
  const fullProducts: ProductCardProps[] = products.map((p) => ({
    ...p,
    onAddToCart: noop,
    onCompare: noop,
    onFavorite: noop,
  }));

  return (
    <>
      {/* 1 — Categories */}
      <CategoriesGrid onCategoryClick={noopStr} />

      {/* 2 — Best Sellers (70%) + Product of the Day (30%) */}
      <section className={styles.bestSellersSection}>
        <div className={styles.bestSellersWrap}>
          <BestSellers products={fullProducts} />
          <ProductOfDay product={{ ...productOfDay, endsAt: ENDS_AT }} onAddToCart={noop} />
        </div>
      </section>

      {/* 3 — Brands */}
      <BrandsSection onBrandClick={noopStr} />

      {/* 4 — Trust strip */}
      <TrustStrip />

      {/* 5 — Subscribe banner */}
      <SubscribeBanner />

      {/* 6 — Popular tags */}
      <PopularTags />
    </>
  );
}
