'use client';

import { useTranslations } from 'next-intl';
import { useVerticalConfig } from '@/lib/vertical-context';
import styles from './HowItWorksSection.module.css';

export default function HowItWorksSection() {
  const t = useTranslations('howItWorks');
  const vConfig = useVerticalConfig();

  if (vConfig.vertical !== 'FOOD_MARKET') return null;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.label}>{t('label')}</span>
          <h2 className={styles.title}>{t('title')}</h2>
          <p className={styles.subtitle}>{t('subtitle')}</p>
        </div>

        {/* 3-step flow */}
        <div className={styles.steps}>
          {/* Step 1 */}
          <div className={styles.step}>
            <div className={styles.stepIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <span className={styles.stepBadge}>1</span>
            </div>
            <h3 className={styles.stepTitle}>{t('step1Title')}</h3>
            <p className={styles.stepDesc}>{t('step1Desc')}</p>
          </div>

          {/* Step 2 */}
          <div className={styles.step}>
            <div className={styles.stepIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 2v4" />
                <path d="M16 2v4" />
                <path d="M21 11.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6.5" />
                <path d="M3 10h18" />
                <circle cx="18" cy="18" r="4" />
                <path d="M18 16.5V18l1 1" />
              </svg>
              <span className={styles.stepBadge}>2</span>
            </div>
            <h3 className={styles.stepTitle}>{t('step2Title')}</h3>
            <p className={styles.stepDesc}>{t('step2Desc')}</p>
          </div>

          {/* Step 3 */}
          <div className={styles.step}>
            <div className={styles.stepIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                <path d="m7.5 4.27 9 5.15" />
                <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                <path d="m3.3 7 8.7 5 8.7-5" />
                <path d="M12 22V12" />
              </svg>
              <span className={styles.stepBadge}>3</span>
            </div>
            <h3 className={styles.stepTitle}>{t('step3Title')}</h3>
            <p className={styles.stepDesc}>{t('step3Desc')}</p>
          </div>
        </div>

        {/* Checkmark pills */}
        <div className={styles.pills}>
          <span className={styles.pill}>
            <span className={styles.pillCheck}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </span>
            {t('pill1')}
          </span>
          <span className={styles.pill}>
            <span className={styles.pillCheck}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </span>
            {t('pill2')}
          </span>
          <span className={styles.pill}>
            <span className={styles.pillCheck}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </span>
            {t('pill3')}
          </span>
        </div>
      </div>
    </section>
  );
}
