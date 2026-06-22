/**
 * Centralised server-side environment variables.
 * Import from here — never read process.env.STORE_SLUG directly in route files.
 * This file is SERVER-ONLY — do not import in 'use client' components.
 */

/** Active store slug — set per-deployment via Vercel Environment Variables. */
export const STORE_SLUG = process.env.STORE_SLUG ?? 'electromarket';

/** Active region bundle — UA (uk/ru/en) or EU (de/en/sk/cs). */
export const REGION_BUNDLE = process.env.REGION_BUNDLE ?? 'UA';
