'use client';

import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { useVerticalConfig } from '@/lib/vertical-context';
import styles from './HeroSection.module.css';

interface DailySpecial {
  name: string;
  price: number;
  currency: string;
}

interface FeaturedProduct {
  name: string;
  weight: string;
  price: number;
  currency: string;
  badge?: string;
  image?: string;
}

interface HeroSectionProps {
  storeName: string;
  heroImage?: string;
  dailySpecial?: DailySpecial;
  productCount?: number;
  avgDeliveryMin?: number;
  reviewCount?: number;
  rating?: number;
  featuredProduct?: FeaturedProduct;
}

export default function HeroSection({
  storeName,
  heroImage,
  dailySpecial,
  avgDeliveryMin,
  reviewCount,
  rating,
  featuredProduct,
}: HeroSectionProps) {
  const t  = useTranslations('hero');
  const tf = useTranslations('heroFood');
  const vConfig = useVerticalConfig();

  // ── Food Market Hero ────────────────────────────────────────────
  if (vConfig.vertical === 'FOOD_MARKET') {
    return (
      <section className={styles.heroFood} aria-label={storeName}>
        {/* Left content */}
        <div className={styles.foodContent}>
          <span className={styles.foodBadge}>
            <span className={styles.foodBadgeDot} />
            {tf('badge')}
          </span>

          <h1 className={styles.foodTitle}>
            {tf('title')}{' '}
            <span className={styles.foodTitleAccent}>{tf('titleAccent')}</span>
          </h1>

          <p className={styles.foodSubtitle}>{tf('subtitle')}</p>

          <div className={styles.foodButtons}>
            <Link href="/catalog" className={styles.foodBtnPrimary}>
              {tf('orderNow')} <span className={styles.foodArrow}>→</span>
            </Link>
            <Link href="/catalog" className={styles.foodBtnOutline}>
              {tf('viewCatalog')}
            </Link>
          </div>

          <p className={styles.foodTrust}>
            {tf('productCount')} · {tf('deliveryTime')} · {tf('freeFrom')}
          </p>
        </div>

        {/* Right — image + floating cards */}
        <div className={styles.foodImageArea}>
          <div className={styles.foodImageWrap}>
            <Image
              src={heroImage ?? '/food-hero-placeholder.svg'}
              alt={storeName}
              fill
              className={styles.foodImage}
              priority
              unoptimized={(heroImage ?? '/food-hero-placeholder.svg').endsWith('.svg')}
            />
          </div>

          {/* Floating: delivery time */}
          <div className={`${styles.foodFloat} ${styles.foodFloatDelivery}`}>
            <span className={styles.foodFloatIcon}>🚴</span>
            <div>
              <strong className={styles.foodFloatValue}>{avgDeliveryMin ?? 30} min</strong>
              <span className={styles.foodFloatLabel}>{tf('avgDelivery')}</span>
            </div>
          </div>

          {/* Floating: rating */}
          <div className={`${styles.foodFloat} ${styles.foodFloatRating}`}>
            <span className={styles.foodFloatIcon}>⭐</span>
            <div>
              <strong className={styles.foodFloatValue}>{rating ?? 4.9}/5</strong>
              <span className={styles.foodFloatLabel}>
                {(reviewCount ?? 32000).toLocaleString()}+ {tf('reviews')}
              </span>
            </div>
          </div>

          {/* Floating: featured product */}
          {featuredProduct && (
            <div className={`${styles.foodFloat} ${styles.foodFloatProduct}`}>
              {featuredProduct.image && (
                <Image
                  src={featuredProduct.image}
                  alt={featuredProduct.name}
                  width={48}
                  height={48}
                  className={styles.foodFloatProductImg}
                  unoptimized={featuredProduct.image.endsWith('.svg')}
                />
              )}
              <div>
                <strong className={styles.foodFloatProductName}>{featuredProduct.name}</strong>
                <span className={styles.foodFloatProductMeta}>{featuredProduct.weight}</span>
                <span className={styles.foodFloatProductPrice}>
                  {featuredProduct.currency} {featuredProduct.price.toFixed(2)}
                </span>
              </div>
              {featuredProduct.badge && (
                <span className={styles.foodFloatBadge}>{featuredProduct.badge}</span>
              )}
            </div>
          )}
        </div>
      </section>
    );
  }

  // ── Restaurant Hero (default, unchanged) ────────────────────────
  return (
    <section className={styles.hero} aria-label={storeName}>
      {/* Left — text content */}
      <div className={styles.content}>
        <p className={styles.tagline}>
          <span className={styles.taglineLine} />
          {t('tagline')}
        </p>

        <h1 className={styles.title}>
          {t('title')}{' '}
          <em className={styles.titleAccent}>{t('titleAccent')}</em>{' '}
          {t('titleEnd')}
        </h1>

        <p className={styles.subtitle}>{t('subtitle')}</p>

        <div className={styles.buttons}>
          <Link href="/reservations" className={styles.btnPrimary}>
            {t('bookTable')}
          </Link>
          <Link href="/catalog" className={styles.btnSecondary}>
            {t('viewMenu')}
          </Link>
        </div>

        <p className={styles.trustLine}>
          ⭐ {t('googleRating')} &nbsp;·&nbsp; 🕐 {t('openUntil')} &nbsp;·&nbsp; 📍 Rome, Italy
        </p>
      </div>

      {/* Right — image */}
      <div className={styles.imageWrap}>
        <Image
          src={heroImage ?? '/placeholder-product.svg'}
          alt={storeName}
          fill
          className={styles.image}
          priority
          unoptimized
        />
        <div className={styles.imageOverlay} />
      </div>

      {/* Promo card */}
      {dailySpecial && (
        <div className={styles.promoCard}>
          <p className={styles.promoTitle}>{t('todaysSpecial')}</p>
          <p className={styles.promoName}>{dailySpecial.name}</p>
          <p className={styles.promoPrice}>
            {dailySpecial.currency}{dailySpecial.price}
          </p>
          <Link href="/catalog" className={styles.promoBtn}>
            {t('orderNow')}
          </Link>
        </div>
      )}
    </section>
  );
}
