'use client';

import { useState, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import styles from './CheckoutForm.module.css';

type DeliveryMethod = 'branch' | 'courier' | 'pickup';
type PaymentMethod = 'wayforpay' | 'liqpay' | 'cod' | 'installments';

interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  deliveryMethod: DeliveryMethod;
  city: string;
  branch: string;
  paymentMethod: PaymentMethod;
  comment: string;
}

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

function BoxIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" {...stroke} aria-hidden="true">
      <path d="M21 8 12 3 3 8v8l9 5 9-5V8Z" />
      <path d="m3 8 9 5 9-5M12 13v8" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" {...stroke} aria-hidden="true">
      <path d="M3 6.5h11v9H3zM14 9.5h4l3 3v3h-7z" />
      <circle cx="7" cy="17.5" r="1.6" />
      <circle cx="17.5" cy="17.5" r="1.6" />
    </svg>
  );
}

function StoreIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" {...stroke} aria-hidden="true">
      <path d="M4 9.5V20h16V9.5" />
      <path d="M3 4h18l1 5.5a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0L3 4Z" />
      <path d="M9.5 20v-5h5v5" />
    </svg>
  );
}

function CardIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" {...stroke} aria-hidden="true">
      <rect x="2.5" y="5.5" width="19" height="13" rx="2" />
      <path d="M2.5 9.5h19M6 14.5h4" />
    </svg>
  );
}

function CashIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" {...stroke} aria-hidden="true">
      <rect x="2.5" y="6" width="19" height="12" rx="2" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );
}

function SplitIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" {...stroke} aria-hidden="true">
      <rect x="3" y="5" width="18" height="6" rx="1.5" />
      <rect x="3" y="14" width="11" height="5" rx="1.5" />
    </svg>
  );
}

export default function CheckoutForm() {
  const t = useTranslations('checkout');
  const router = useRouter();

  const [data, setData] = useState<FormData>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    deliveryMethod: 'branch',
    city: '',
    branch: '',
    paymentMethod: 'wayforpay',
    comment: '',
  });
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setData((d) => ({ ...d, [key]: value }));

  const deliveryCards: { value: DeliveryMethod; label: string; icon: ReactNode }[] = [
    { value: 'branch', label: t('novaPoshta'), icon: <BoxIcon /> },
    { value: 'courier', label: t('novaPoshtaCourier'), icon: <TruckIcon /> },
    { value: 'pickup', label: t('selfPickup'), icon: <StoreIcon /> },
  ];

  const paymentCards: { value: PaymentMethod; label: string; icon: ReactNode }[] = [
    { value: 'wayforpay', label: t('payOnline'), icon: <CardIcon /> },
    { value: 'liqpay', label: t('liqpay'), icon: <CardIcon /> },
    { value: 'cod', label: t('cashOnDelivery'), icon: <CashIcon /> },
    { value: 'installments', label: t('installments'), icon: <SplitIcon /> },
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const nextErrors: Record<string, boolean> = {
      firstName: !data.firstName.trim(),
      lastName: !data.lastName.trim(),
      phone: !data.phone.trim(),
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;
    console.log('[checkout submit]', data);
    router.push('/checkout/success');
  };

  const field = (
    key: 'firstName' | 'lastName' | 'phone' | 'email',
    type = 'text',
  ) => (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={key}>
        {t(key)}
      </label>
      <input
        id={key}
        type={type}
        className={`${styles.input} ${errors[key] ? styles.inputError : ''}`}
        value={data[key]}
        onChange={(e) => {
          set(key, e.target.value);
          if (errors[key]) setErrors((prev) => ({ ...prev, [key]: false }));
        }}
      />
      {errors[key] && <span className={styles.errorMsg}>{t('required')}</span>}
    </div>
  );

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {/* Contact info */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{t('contactInfo')}</h2>
        <div className={styles.grid2}>
          {field('firstName')}
          {field('lastName')}
          {field('phone', 'tel')}
          {field('email', 'email')}
        </div>
      </section>

      {/* Delivery */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{t('delivery')}</h2>
        <div className={styles.cards}>
          {deliveryCards.map((card) => (
            <label
              key={card.value}
              className={`${styles.card} ${data.deliveryMethod === card.value ? styles.cardActive : ''}`}
            >
              <input
                type="radio"
                name="delivery"
                checked={data.deliveryMethod === card.value}
                onChange={() => set('deliveryMethod', card.value)}
              />
              <span className={styles.cardIcon}>{card.icon}</span>
              <span className={styles.cardLabel}>{card.label}</span>
            </label>
          ))}
        </div>

        {data.deliveryMethod !== 'pickup' && (
          <div className={styles.grid2}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="city">
                {t('city')}
              </label>
              <input
                id="city"
                type="text"
                className={styles.input}
                value={data.city}
                onChange={(e) => set('city', e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="branch">
                {t('branch')}
              </label>
              <input
                id="branch"
                type="text"
                className={styles.input}
                value={data.branch}
                onChange={(e) => set('branch', e.target.value)}
              />
            </div>
          </div>
        )}
      </section>

      {/* Payment */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{t('payment')}</h2>
        <div className={styles.cards}>
          {paymentCards.map((card) => (
            <label
              key={card.value}
              className={`${styles.card} ${data.paymentMethod === card.value ? styles.cardActive : ''}`}
            >
              <input
                type="radio"
                name="payment"
                checked={data.paymentMethod === card.value}
                onChange={() => set('paymentMethod', card.value)}
              />
              <span className={styles.cardIcon}>{card.icon}</span>
              <span className={styles.cardLabel}>{card.label}</span>
            </label>
          ))}
        </div>
      </section>

      {/* Comment */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{t('comment')}</h2>
        <textarea
          className={styles.textarea}
          rows={3}
          placeholder={t('commentPlaceholder')}
          value={data.comment}
          onChange={(e) => set('comment', e.target.value)}
        />
      </section>

      <button type="submit" className={styles.submit}>
        {t('submit')}
      </button>
    </form>
  );
}
