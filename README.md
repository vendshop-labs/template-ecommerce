# vendshop-template-ecommerce

**Next.js 15 e-commerce template** — catalog, cart, checkout, AI admin, 7 languages, DACH legal. Fork & deploy in ~1 hour.

Part of the [vendshop-labs](https://github.com/vendshop-labs) template family.

---

## What's included

| Feature | Details |
|---|---|
| Product catalog | Categories, brands, filters, image gallery |
| Shopping cart | Persistent cart, promo codes, delivery zones |
| Checkout | Order creation, order history per customer |
| Admin panel | `/admin` — products, categories, orders, theme, AI chat |
| AI admin assistant | OpenAI or Anthropic — ask in any language |
| Theme editor | Live color customization per store |
| 7 languages | uk · ru · en · de · sk · cs · pl |
| DACH legal pages | Impressum + Datenschutz (visible only for `/de/` locale) |
| GDPR cookie banner | localStorage-based consent, 7 translations |
| Multi-store | Switch store via `STORE_SLUG` env var |
| Verticals | ECOMMERCE · FOOD\_MARKET · SHOE\_MARKET · RESTAURANT |

---

## Tech stack

- **Next.js 15** — App Router, Server Components, `unstable_cache`
- **TypeScript** — strict mode
- **Prisma + Neon** — PostgreSQL (serverless)
- **CSS Modules** — no Tailwind, CSS variables for all tokens
- **next-intl** — 7 locales with per-region routing
- **Vercel Blob** — image uploads
- **HMAC-SHA256** — stateless admin sessions (no NextAuth dependency)

---

## Fork & deploy in ~1 hour

### 1. Clone & install

```bash
git clone https://github.com/vendshop-labs/template-ecommerce.git my-store
cd my-store
pnpm install --config.node-linker=hoisted
```

### 2. Environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | Neon PostgreSQL connection string |
| `STORE_SLUG` | ✅ | `electromarket` (or your store slug after seeding) |
| `ADMIN_SECRET` | ✅ | Random 32-char string — signs admin tokens |
| `NEXT_PUBLIC_SITE_URL` | ✅ | Your production domain |
| `BLOB_READ_WRITE_TOKEN` | ✅ | Vercel Blob token for image uploads |
| `OPENAI_API_KEY` | optional | AI admin assistant |
| `ANTHROPIC_API_KEY` | optional | AI admin assistant (alternative) |
| `REGION_BUNDLE` | optional | `UA` (uk/ru/en) or `EU` (de/sk/cs/en) |

Generate `ADMIN_SECRET`:
```bash
openssl rand -hex 32
```

### 3. Database setup

```bash
npx prisma migrate deploy
npx prisma db seed
```

### 4. Run locally

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) for the storefront, [http://localhost:3000/admin](http://localhost:3000/admin) for the admin panel.

### 5. Deploy to Vercel

```bash
vercel deploy --prod
```

Set the same env vars in **Vercel Dashboard → Project → Settings → Environment Variables**.

---

## Admin access

- URL: `/admin/login`
- Default demo credentials: `admin@electromarket.ua` / `admin123`
- **Change before production** — create a new admin via `prisma studio` or the DB

Admin sessions use HMAC-SHA256 tokens (httpOnly cookie, 7-day expiry) signed with `ADMIN_SECRET`. No NextAuth required.

---

## DACH legal pages

Fill in company info at `/admin/legal` (Legal section in the admin sidebar).

Toggle **Impressum & Datenschutz aktivieren** → pages appear at:
- `/de/impressum`
- `/de/datenschutz`

Pages are 404 for all other locales.

---

## Multi-store / white-label

One codebase, multiple stores — switch via `STORE_SLUG`:

```env
STORE_SLUG=electromarket   # tools store (ECOMMERCE)
STORE_SLUG=krajina         # grocery delivery (FOOD_MARKET)
STORE_SLUG=stepstyle       # shoe store (SHOE_MARKET)
```

Theme, categories, products, and legal config are all per-store in the DB.
