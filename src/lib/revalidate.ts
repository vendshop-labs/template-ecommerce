import { revalidatePath, revalidateTag } from 'next/cache';
import { STORE_SLUG } from '@/lib/env';

const LOCALES = ['en', 'de', 'sk', 'cs', 'uk', 'ru', 'pl'];

export function revalidateStorefront() {
  revalidatePath('/', 'layout');
  for (const locale of LOCALES) {
    revalidatePath(`/${locale}`);
  }
  revalidateTag('products');
  revalidateTag('store-config');
  revalidateTag(STORE_SLUG);
}

export function revalidateCatalog() {
  revalidateStorefront();
  for (const locale of LOCALES) {
    revalidatePath(`/${locale}/catalog`);
  }
}
