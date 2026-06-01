import { PrismaClient, Vertical, DeliveryMode, OrderStatus, PaymentStatus, PromoType } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcryptjs from 'bcryptjs';
import 'dotenv/config';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const db = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database...');

  // ============ STORE ============
  const store = await db.store.upsert({
    where: { slug: 'electromarket' },
    update: {},
    create: {
      name: 'ElectroMarket',
      slug: 'electromarket',
      vertical: Vertical.ECOMMERCE,
      regionBundle: 'UA',
      themeConfig: {
        primaryColor: '#1A1A2E',
        secondaryColor: '#16213E',
        accentColor: '#E94560',
        cardStyle: 'shadow',
        heroType: 'full-width',
        navPosition: 'top',
      },
    },
  });
  console.log('✅ Store:', store.slug);

  // ============ CATEGORIES ============
  const categoryData = [
    { slug: 'drills', nameKey: 'drills', sortOrder: 1 },
    { slug: 'grinders', nameKey: 'grinders', sortOrder: 2 },
    { slug: 'perforators', nameKey: 'perforators', sortOrder: 3 },
    { slug: 'jigsaws', nameKey: 'jigsaws', sortOrder: 4 },
    { slug: 'sanders', nameKey: 'sanders', sortOrder: 5 },
    { slug: 'lasers', nameKey: 'lasers', sortOrder: 6 },
    { slug: 'measuring', nameKey: 'measuring', sortOrder: 7 },
    { slug: 'accessories', nameKey: 'accessories', sortOrder: 8 },
  ];

  const categories: Record<string, string> = {};
  for (const cat of categoryData) {
    const created = await db.category.upsert({
      where: { storeId_slug: { storeId: store.id, slug: cat.slug } },
      update: {},
      create: { ...cat, storeId: store.id },
    });
    categories[cat.slug] = created.id;
  }
  console.log('✅ Categories:', Object.keys(categories).length);

  // ============ PRODUCTS ============
  const productData = [
    {
      slug: 'makita-df333dsae',
      nameKey: 'makitaDrill',
      brand: 'MAKITA',
      categorySlug: 'drills',
      price: 2990,
      oldPrice: 3499,
      rating: 4.5,
      reviewCount: 127,
      inStock: true,
      isHit: true,
      metadata: {
        sku: 'DF333DSAE',
        stockQty: 15,
        specs: {
          uk: [
            { label: 'Потужність', value: '800 Вт' },
            { label: 'Напруга', value: '12В' },
            { label: 'Тип акумулятора', value: 'Li-Ion' },
            { label: 'Швидкість', value: '0-1500 об/хв' },
            { label: 'Макс. крутний момент', value: '30 Нм' },
            { label: 'Вага', value: '1.5 кг' },
            { label: 'Гарантія', value: '1 рік' },
          ],
          en: [
            { label: 'Power', value: '800 W' },
            { label: 'Voltage', value: '12V' },
            { label: 'Battery type', value: 'Li-Ion' },
            { label: 'Speed', value: '0-1500 rpm' },
            { label: 'Max torque', value: '30 Nm' },
            { label: 'Weight', value: '1.5 kg' },
            { label: 'Warranty', value: '1 year' },
          ],
        },
        description: {
          uk: 'Професійна акумуляторна дриль-шурупокрут Makita DF333DSAE — компактний і потужний інструмент для свердління та закручування. Оснащена двошвидкісним редуктором, LED-підсвічуванням та ергономічною прогумованою рукояткою.',
          en: 'The Makita DF333DSAE cordless drill-driver is a compact yet powerful tool for drilling and driving. It features a two-speed gearbox, an LED work light, and an ergonomic rubberized grip.',
          ru: 'Профессиональная аккумуляторная дрель-шуруповёрт Makita DF333DSAE — компактный и мощный инструмент. Оснащена двухскоростным редуктором, светодиодной подсветкой и эргономичной рукояткой.',
          de: 'Der Makita DF333DSAE Akku-Bohrschrauber ist ein kompaktes und kraftvolles Werkzeug. Mit Zwei-Gang-Getriebe, LED-Arbeitsleuchte und ergonomischem Griff.',
          sk: 'Profesionálny akumulátorový vŕtací skrutkovač Makita DF333DSAE. Dvojrýchlostná prevodovka, LED osvetlenie a ergonomická rukoväť.',
          cs: 'Profesionální aku vrtací šroubovák Makita DF333DSAE. Dvourychlostní převodovka, LED osvětlení a ergonomická rukojeť.',
        },
      },
    },
    {
      slug: 'dewalt-dwe4157',
      nameKey: 'dewaltGrinder',
      brand: 'DEWALT',
      categorySlug: 'grinders',
      price: 3199,
      oldPrice: 4099,
      rating: 4,
      reviewCount: 56,
      inStock: true,
      isHit: true,
      metadata: { sku: 'DWE4157', stockQty: 8 },
    },
    {
      slug: 'bosch-gbh-2-26',
      nameKey: 'boschPerforator',
      brand: 'BOSCH',
      categorySlug: 'perforators',
      price: 5749,
      rating: 5,
      reviewCount: 84,
      inStock: true,
      isNew: true,
      metadata: { sku: 'GBH226DRE', stockQty: 12 },
    },
    {
      slug: 'milwaukee-m18-fiw2f12',
      nameKey: 'milwaukeeImpact',
      brand: 'MILWAUKEE',
      categorySlug: 'drills',
      price: 8999,
      oldPrice: 10999,
      rating: 4.5,
      reviewCount: 91,
      inStock: true,
      isHit: true,
      metadata: { sku: 'FIW2F12', stockQty: 5 },
    },
    {
      slug: 'metabo-steb-65',
      nameKey: 'metaboJigsaw',
      brand: 'METABO',
      categorySlug: 'jigsaws',
      price: 4290,
      rating: 5,
      reviewCount: 38,
      inStock: true,
      isNew: true,
      metadata: { sku: 'STEB65', stockQty: 20 },
    },
    {
      slug: 'makita-hr2470',
      nameKey: 'makitaPerforator',
      brand: 'MAKITA',
      categorySlug: 'perforators',
      price: 4599,
      oldPrice: 5250,
      rating: 4.5,
      reviewCount: 203,
      inStock: true,
      isHit: true,
      metadata: { sku: 'HR2470', stockQty: 10 },
    },
    {
      slug: 'bosch-gex-40-150',
      nameKey: 'boschSander',
      brand: 'BOSCH',
      categorySlug: 'sanders',
      price: 6290,
      oldPrice: 8990,
      rating: 4,
      reviewCount: 42,
      inStock: true,
      metadata: { sku: 'GEX40150', stockQty: 7 },
    },
    {
      slug: 'dewalt-dwd024',
      nameKey: 'dewaltDrill',
      brand: 'DEWALT',
      categorySlug: 'drills',
      price: 2450,
      rating: 4.5,
      reviewCount: 67,
      inStock: true,
      isHit: true,
      metadata: { sku: 'DWD024', stockQty: 25 },
    },
    {
      slug: 'milwaukee-m18-fsag125xb',
      nameKey: 'milwaukeeGrinder',
      brand: 'MILWAUKEE',
      categorySlug: 'grinders',
      price: 7990,
      oldPrice: 10650,
      rating: 5,
      reviewCount: 19,
      inStock: true,
      isNew: true,
      metadata: { sku: 'FSAG125XB', stockQty: 6 },
    },
  ];

  const products: Record<string, string> = {};
  for (const p of productData) {
    const { categorySlug, ...rest } = p;
    const created = await db.product.upsert({
      where: { storeId_slug: { storeId: store.id, slug: p.slug } },
      update: {},
      create: {
        ...rest,
        image: '/placeholder-product.svg',
        images: [],
        currency: 'грн',
        storeId: store.id,
        categoryId: categories[categorySlug],
      },
    });
    products[p.slug] = created.id;
  }
  console.log('✅ Products:', Object.keys(products).length);

  // ============ ADMIN USER ============
  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@electromarket.ua';
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'admin123';
  const passwordHash = await bcryptjs.hash(adminPassword, 12);

  await db.adminUser.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: {
      email: adminEmail,
      passwordHash,
      name: 'Admin',
      role: 'superadmin',
      storeId: store.id,
    },
  });
  console.log('✅ AdminUser:', adminEmail);

  // ============ CUSTOMERS ============
  const customersData = [
    { email: 'ivan@example.ua', name: 'Іван Петренко', phone: '+380671234567' },
    { email: 'olga@example.ua', name: 'Ольга Коваль', phone: '+380501112233' },
    { email: 'mykola@example.ua', name: 'Микола Бондар', phone: '+380937654321' },
  ];

  const customerIds: string[] = [];
  for (const c of customersData) {
    const created = await db.customer.upsert({
      where: { storeId_email: { storeId: store.id, email: c.email } },
      update: {},
      create: { ...c, storeId: store.id },
    });
    customerIds.push(created.id);
  }
  console.log('✅ Customers:', customerIds.length);

  // ============ DELIVERY ZONES ============
  const zonesData = [
    { name: 'Зона 1 — Центр', fee: 0, minOrder: 2000, estimatedMin: 30, estimatedMax: 45 },
    { name: 'Зона 2 — Середмістя', fee: 60, minOrder: 1000, estimatedMin: 45, estimatedMax: 70 },
    { name: 'Зона 3 — Передмістя', fee: 120, minOrder: 500, estimatedMin: 60, estimatedMax: 90 },
  ];

  const zoneIds: string[] = [];
  for (const z of zonesData) {
    const existing = await db.deliveryZone.findFirst({ where: { storeId: store.id, name: z.name } });
    if (!existing) {
      const created = await db.deliveryZone.create({ data: { ...z, storeId: store.id } });
      zoneIds.push(created.id);
    } else {
      zoneIds.push(existing.id);
    }
  }
  console.log('✅ DeliveryZones:', zoneIds.length);

  // ============ SAMPLE ORDERS ============
  const ordersData = [
    {
      orderNumber: 'EM-2026-0001',
      status: OrderStatus.DELIVERED,
      customerId: customerIds[0],
      guestEmail: null,
      deliveryMode: DeliveryMode.SHIPPING,
      paymentMethod: 'wayforpay',
      paymentStatus: PaymentStatus.PAID,
      subtotal: 2990,
      deliveryFee: 0,
      discount: 0,
      total: 2990,
      currency: 'грн',
      items: [{ productId: products['makita-df333dsae'], quantity: 1, price: 2990 }],
    },
    {
      orderNumber: 'EM-2026-0002',
      status: OrderStatus.SHIPPED,
      customerId: customerIds[1],
      guestEmail: null,
      deliveryMode: DeliveryMode.SHIPPING,
      paymentMethod: 'liqpay',
      paymentStatus: PaymentStatus.PAID,
      subtotal: 3199,
      deliveryFee: 60,
      discount: 0,
      total: 3259,
      currency: 'грн',
      items: [{ productId: products['dewalt-dwe4157'], quantity: 1, price: 3199 }],
    },
    {
      orderNumber: 'EM-2026-0003',
      status: OrderStatus.PENDING,
      customerId: null,
      guestEmail: 'guest@example.ua',
      guestName: 'Гість Клієнт',
      guestPhone: '+380441234567',
      deliveryMode: DeliveryMode.SHIPPING,
      paymentMethod: 'cod',
      paymentStatus: PaymentStatus.UNPAID,
      subtotal: 8999,
      deliveryFee: 0,
      discount: 500,
      total: 8499,
      currency: 'грн',
      items: [{ productId: products['milwaukee-m18-fiw2f12'], quantity: 1, price: 8999 }],
    },
  ];

  for (const order of ordersData) {
    const exists = await db.order.findFirst({ where: { storeId: store.id, orderNumber: order.orderNumber } });
    if (!exists) {
      const { items, guestName, guestPhone, ...orderRest } = order;
      await db.order.create({
        data: {
          ...orderRest,
          guestName: guestName ?? null,
          guestPhone: guestPhone ?? null,
          storeId: store.id,
          deliveryAddress: { city: 'Київ', country: 'UA' },
          items: { create: items },
        },
      });
    }
  }
  console.log('✅ Orders: 3');

  // ============ PROMOTIONS ============
  const promosData = [
    {
      type: PromoType.PRODUCT_OF_DAY,
      title: 'Bosch GBH 2-26 — Product of the Day',
      description: 'Professional rotary hammer at a special price',
      discountPercent: 15,
      productIds: [products['bosch-gbh-2-26']],
      categoryIds: [],
      startsAt: new Date('2026-06-01'),
      endsAt: new Date('2026-06-03'),
      active: true,
    },
    {
      type: PromoType.DISCOUNT,
      title: 'Summer Sale — Makita -10%',
      description: 'Special discount on all Makita tools',
      discountPercent: 10,
      productIds: [products['makita-df333dsae'], products['makita-hr2470']],
      categoryIds: [],
      startsAt: new Date('2026-06-01'),
      endsAt: new Date('2026-06-30'),
      active: true,
    },
    {
      type: PromoType.FREE_DELIVERY,
      title: 'Free Delivery on orders 2000+ UAH',
      discountAmount: 0,
      productIds: [],
      categoryIds: [],
      startsAt: new Date('2026-01-01'),
      active: true,
    },
  ];

  for (const promo of promosData) {
    const exists = await db.promotion.findFirst({ where: { storeId: store.id, title: promo.title } });
    if (!exists) {
      await db.promotion.create({ data: { ...promo, storeId: store.id } });
    }
  }
  console.log('✅ Promotions: 3');

  // ============ KNOWLEDGE BASE ============
  const knowledgeData = [
    {
      title: 'Доставка — Nova Poshta',
      content:
        'Доставляємо по всій Україні через Нову Пошту. Термін доставки 1-2 робочих дні. Безкоштовна доставка при замовленні від 2000 грн. Самовивіз доступний в офісі щодня з 9:00 до 18:00.',
      category: 'delivery',
    },
    {
      title: 'Гарантія на інструменти',
      content:
        'На всі інструменти надається офіційна гарантія виробника: Makita — 1 рік, Bosch — 2 роки, DeWalt — 3 роки, Milwaukee — 5 років, Metabo — 2 роки. Гарантійний ремонт здійснюється в авторизованих сервісних центрах.',
      category: 'warranty',
    },
    {
      title: 'Повернення та обмін',
      content:
        'Повернення товару належної якості — протягом 14 днів з моменту отримання. Товар повинен бути в оригінальній упаковці без слідів використання. Повернення коштів — протягом 5 робочих днів після підтвердження.',
      category: 'returns',
    },
    {
      title: 'Способи оплати',
      content:
        'Приймаємо оплату: WayForPay (Visa/MasterCard), LiqPay (PrivatBank), готівка при доставці (накладений платіж), оплата частинами (Monobank, PrivatBank). При оплаті карткою комісія не стягується.',
      category: 'payment',
    },
    {
      title: 'Часті питання — акумуляторні дрелі',
      content:
        'Q: Яка різниця між дриллю та шурупокрутом? A: Дриль призначена для свердління, шурупокрут — для закручування. Q: Який акумулятор краще — 12В чи 18В? A: 18В потужніший, 12В компактніший і легший. Q: Чи сумісні акумулятори між моделями? A: В межах одного бренду та платформи — зазвичай так.',
      category: 'faq',
    },
  ];

  for (const entry of knowledgeData) {
    const exists = await db.knowledgeEntry.findFirst({ where: { storeId: store.id, title: entry.title } });
    if (!exists) {
      await db.knowledgeEntry.create({ data: { ...entry, storeId: store.id } });
    }
  }
  console.log('✅ KnowledgeBase:', knowledgeData.length, 'entries');

  console.log('\n🎉 Seed complete!');
  console.log(`   Store slug:   ${store.slug}`);
  console.log(`   Admin email:  ${adminEmail}`);
  console.log(`   Admin pass:   ${adminPassword}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
    await pool.end();
  });
