import { PrismaClient, Vertical, DeliveryMode, OrderStatus, PaymentStatus } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcryptjs from 'bcryptjs';
import 'dotenv/config';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const db = new PrismaClient({ adapter } as never);

async function main() {
  console.log('🛒 Seeding Krajina Fresh Market (Food Market)...');

  // ============ STORE ============
  const store = await db.store.upsert({
    where: { slug: 'krajina' },
    update: {},
    create: {
      name: 'Krajina Fresh Market',
      slug: 'krajina',
      vertical: Vertical.FOOD_MARKET,
      regionBundle: 'UA',
      themeConfig: {
        colors: {
          bg:             '#fafaf5',
          primary:        '#4d7c0f',
          primaryDark:    '#365314',
          primaryLight:   '#f7fee7',
          text:           '#1c1917',
          textSecondary:  '#78716c',
          textMuted:      '#a8a29e',
          border:         '#e7e5e4',
          bgSubtle:       '#f5f5f0',
          success:        '#16a34a',
          error:          '#ef4444',
          contrast:       '#ffffff',
          overlay:        '#ffffff',
          overlayAlpha:   'rgba(250,250,245,0.85)',
          headerBg:       'rgba(250,250,245,0.9)',
          bgDark:         '#1c1917',
          warning:        '#d97706',
          successLight:   '#ecfccb',
          errorLight:     '#fef2f2',
          infoLight:      '#f0fdf4',
        },
        layout: {
          heroType:     'full-width',
          cardStyle:    'shadow',
          navPosition:  'top',
          borderRadius: 'rounded',
        },
      },
    },
  });
  console.log('✅ Store:', store.slug);

  // ============ CATEGORIES ============
  const categoryData = [
    { slug: 'fruits',     nameKey: 'Фрукти',      sortOrder: 1 },
    { slug: 'vegetables', nameKey: 'Овочі',        sortOrder: 2 },
    { slug: 'dairy',      nameKey: 'Молочне',      sortOrder: 3 },
    { slug: 'meat',       nameKey: 'М\'ясо',       sortOrder: 4 },
    { slug: 'bakery',     nameKey: 'Випічка',      sortOrder: 5 },
    { slug: 'drinks',     nameKey: 'Напої',        sortOrder: 6 },
    { slug: 'frozen',     nameKey: 'Заморожене',   sortOrder: 7 },
    { slug: 'grocery',    nameKey: 'Бакалія',      sortOrder: 8 },
  ];

  const categories: Record<string, string> = {};
  for (const cat of categoryData) {
    const created = await db.category.upsert({
      where: { storeId_slug: { storeId: store.id, slug: cat.slug } },
      update: { nameKey: cat.nameKey },
      create: { ...cat, storeId: store.id },
    });
    categories[cat.slug] = created.id;
  }
  console.log('✅ Categories:', Object.keys(categories).length);

  // ============ PRODUCTS ============
  const productData = [
    // --- Фрукти ---
    {
      slug: 'apples-golden',
      nameKey: 'Яблука Голден',
      categorySlug: 'fruits',
      price: 45,
      rating: 4.5,
      reviewCount: 128,
      inStock: true,
      isHit: true,
      metadata: { weight: '1 кг', expiryDays: 14, temperature: 'room', organic: false, calories: 52 },
    },
    {
      slug: 'bananas',
      nameKey: 'Банани',
      categorySlug: 'fruits',
      price: 55,
      rating: 4.5,
      reviewCount: 97,
      inStock: true,
      isHit: true,
      metadata: { weight: '1 кг', expiryDays: 7, temperature: 'room', organic: false, calories: 89 },
    },
    {
      slug: 'strawberries',
      nameKey: 'Полуниця',
      categorySlug: 'fruits',
      price: 120,
      rating: 5,
      reviewCount: 203,
      inStock: true,
      isNew: true,
      metadata: { weight: '500 г', expiryDays: 3, temperature: 'refrigerated', organic: true, calories: 32 },
    },
    {
      slug: 'oranges',
      nameKey: 'Апельсини',
      categorySlug: 'fruits',
      price: 65,
      rating: 4.5,
      reviewCount: 76,
      inStock: true,
      metadata: { weight: '1 кг', expiryDays: 14, temperature: 'room', organic: false, calories: 47 },
    },

    // --- Овочі ---
    {
      slug: 'tomatoes-cherry',
      nameKey: 'Томати черрі',
      categorySlug: 'vegetables',
      price: 85,
      rating: 5,
      reviewCount: 154,
      inStock: true,
      isHit: true,
      metadata: { weight: '500 г', expiryDays: 5, temperature: 'room', organic: true, calories: 18 },
    },
    {
      slug: 'cucumbers',
      nameKey: 'Огірки',
      categorySlug: 'vegetables',
      price: 40,
      rating: 4.5,
      reviewCount: 89,
      inStock: true,
      metadata: { weight: '1 кг', expiryDays: 7, temperature: 'room', organic: false, calories: 15 },
    },
    {
      slug: 'potatoes',
      nameKey: 'Картопля молода',
      categorySlug: 'vegetables',
      price: 35,
      rating: 4.5,
      reviewCount: 112,
      inStock: true,
      metadata: { weight: '1 кг', expiryDays: 30, temperature: 'room', organic: false, calories: 77 },
    },
    {
      slug: 'salad-mix',
      nameKey: 'Мікс салатів',
      categorySlug: 'vegetables',
      price: 65,
      rating: 5,
      reviewCount: 67,
      inStock: true,
      isNew: true,
      metadata: { weight: '150 г', expiryDays: 4, temperature: 'refrigerated', organic: true, calories: 20 },
    },

    // --- Молочне ---
    {
      slug: 'milk-organic',
      nameKey: 'Молоко органічне',
      categorySlug: 'dairy',
      price: 42,
      rating: 5,
      reviewCount: 198,
      inStock: true,
      isHit: true,
      metadata: { weight: '1 л', expiryDays: 5, temperature: 'refrigerated', organic: true, calories: 64 },
    },
    {
      slug: 'butter-farm',
      nameKey: 'Масло вершкове фермерське',
      categorySlug: 'dairy',
      price: 85,
      rating: 4.5,
      reviewCount: 143,
      inStock: true,
      metadata: { weight: '200 г', expiryDays: 30, temperature: 'refrigerated', organic: false, calories: 717 },
    },
    {
      slug: 'greek-yogurt',
      nameKey: 'Йогурт грецький',
      categorySlug: 'dairy',
      price: 55,
      rating: 5,
      reviewCount: 87,
      inStock: true,
      isNew: true,
      metadata: { weight: '400 г', expiryDays: 14, temperature: 'refrigerated', organic: true, calories: 97 },
    },
    {
      slug: 'cheese-mozzarella',
      nameKey: 'Моцарела свіжа',
      categorySlug: 'dairy',
      price: 95,
      rating: 5,
      reviewCount: 112,
      inStock: true,
      isHit: true,
      metadata: { weight: '250 г', expiryDays: 7, temperature: 'refrigerated', organic: false, calories: 280 },
    },

    // --- М'ясо ---
    {
      slug: 'chicken-fillet',
      nameKey: 'Куряче філе охолоджене',
      categorySlug: 'meat',
      price: 180,
      rating: 4.5,
      reviewCount: 167,
      inStock: true,
      isHit: true,
      metadata: { weight: '1 кг', expiryDays: 3, temperature: 'refrigerated', organic: false, calories: 165 },
    },
    {
      slug: 'pork-neck',
      nameKey: 'Шийка свиняча',
      categorySlug: 'meat',
      price: 195,
      rating: 4.5,
      reviewCount: 98,
      inStock: true,
      metadata: { weight: '1 кг', expiryDays: 3, temperature: 'refrigerated', organic: false, calories: 241 },
    },
    {
      slug: 'beef-steak',
      nameKey: 'Стейк яловичий',
      categorySlug: 'meat',
      price: 320,
      rating: 5,
      reviewCount: 54,
      inStock: true,
      isNew: true,
      metadata: { weight: '300 г', expiryDays: 3, temperature: 'refrigerated', organic: false, calories: 271 },
    },

    // --- Випічка ---
    {
      slug: 'sourdough-bread',
      nameKey: 'Хліб на заквасці',
      categorySlug: 'bakery',
      price: 65,
      rating: 5,
      reviewCount: 234,
      inStock: true,
      isHit: true,
      metadata: { weight: '500 г', expiryDays: 4, temperature: 'room', organic: true, calories: 245 },
    },
    {
      slug: 'croissant',
      nameKey: 'Круасан вершковий',
      categorySlug: 'bakery',
      price: 35,
      rating: 4.5,
      reviewCount: 178,
      inStock: true,
      metadata: { weight: '80 г', expiryDays: 2, temperature: 'room', organic: false, calories: 406 },
    },

    // --- Напої ---
    {
      slug: 'orange-juice-fresh',
      nameKey: 'Сік апельсиновий свіжовичавлений',
      categorySlug: 'drinks',
      price: 75,
      rating: 5,
      reviewCount: 145,
      inStock: true,
      isHit: true,
      metadata: { weight: '500 мл', expiryDays: 2, temperature: 'refrigerated', organic: true, calories: 112 },
    },
    {
      slug: 'sparkling-water',
      nameKey: 'Вода мінеральна газована',
      categorySlug: 'drinks',
      price: 28,
      rating: 4.5,
      reviewCount: 67,
      inStock: true,
      metadata: { weight: '1.5 л', expiryDays: 365, temperature: 'room', organic: false, calories: 0 },
    },
    {
      slug: 'kombucha',
      nameKey: 'Комбуча органічна',
      categorySlug: 'drinks',
      price: 95,
      rating: 5,
      reviewCount: 43,
      inStock: true,
      isNew: true,
      metadata: { weight: '330 мл', expiryDays: 30, temperature: 'refrigerated', organic: true, calories: 30 },
    },

    // --- Заморожене ---
    {
      slug: 'frozen-pizza-margherita',
      nameKey: 'Піца заморожена Маргарита',
      categorySlug: 'frozen',
      price: 95,
      rating: 4.5,
      reviewCount: 89,
      inStock: true,
      metadata: { weight: '350 г', expiryDays: 180, temperature: 'frozen', organic: false, calories: 266 },
    },
    {
      slug: 'ice-cream-vanilla',
      nameKey: 'Морозиво ванільне',
      categorySlug: 'frozen',
      price: 65,
      rating: 5,
      reviewCount: 212,
      inStock: true,
      isHit: true,
      metadata: { weight: '500 мл', expiryDays: 365, temperature: 'frozen', organic: false, calories: 207 },
    },
    {
      slug: 'frozen-berries-mix',
      nameKey: 'Ягоди заморожені (мікс)',
      categorySlug: 'frozen',
      price: 85,
      rating: 5,
      reviewCount: 134,
      inStock: true,
      metadata: { weight: '400 г', expiryDays: 365, temperature: 'frozen', organic: true, calories: 55 },
    },

    // --- Бакалія ---
    {
      slug: 'olive-oil-extra',
      nameKey: 'Олія оливкова Extra Virgin',
      categorySlug: 'grocery',
      price: 285,
      rating: 5,
      reviewCount: 187,
      inStock: true,
      isHit: true,
      metadata: { weight: '500 мл', expiryDays: 730, temperature: 'room', organic: true, calories: 884 },
    },
    {
      slug: 'granola',
      nameKey: 'Гранола з горіхами',
      categorySlug: 'grocery',
      price: 120,
      rating: 4.5,
      reviewCount: 98,
      inStock: true,
      isNew: true,
      metadata: { weight: '500 г', expiryDays: 90, temperature: 'room', organic: true, calories: 450 },
    },
    {
      slug: 'pasta-spaghetti',
      nameKey: 'Паста спагеті з твердих сортів',
      categorySlug: 'grocery',
      price: 55,
      rating: 4.5,
      reviewCount: 76,
      inStock: true,
      metadata: { weight: '500 г', expiryDays: 730, temperature: 'room', organic: false, calories: 371 },
    },
  ];

  const products: Record<string, string> = {};
  for (const p of productData) {
    const { categorySlug, ...rest } = p;
    const created = await db.product.upsert({
      where: { storeId_slug: { storeId: store.id, slug: p.slug } },
      update: {
        nameKey: rest.nameKey,
        price: rest.price,
        currency: 'UAH',
        metadata: rest.metadata ?? {},
        categoryId: categories[categorySlug],
      },
      create: {
        ...rest,
        image: '/placeholder-product.svg',
        images: [],
        currency: 'UAH',
        storeId: store.id,
        categoryId: categories[categorySlug],
      },
    });
    products[p.slug] = created.id;
  }
  console.log('✅ Products:', Object.keys(products).length);

  // ============ ADMIN USER ============
  const adminEmail = 'admin@krajina.shop';
  const passwordHash = await bcryptjs.hash('admin123', 12);

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
    { email: 'olena@example.ua', name: 'Олена Коваль', phone: '+380671234567' },
    { email: 'mykola@example.ua', name: 'Микола Шевченко', phone: '+380507654321' },
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
    { name: 'Центр',      fee: 0,  minOrder: 300, estimatedMin: 30, estimatedMax: 45 },
    { name: 'Лівий берег', fee: 35, minOrder: 400, estimatedMin: 45, estimatedMax: 60 },
    { name: 'Передмістя', fee: 55, minOrder: 500, estimatedMin: 60, estimatedMax: 90 },
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
      orderNumber: 'KRJ-2026-0001',
      status: OrderStatus.DELIVERED,
      customerId: customerIds[0],
      deliveryMode: DeliveryMode.COURIER,
      paymentMethod: 'card',
      paymentStatus: PaymentStatus.PAID,
      subtotal: 347,
      deliveryFee: 0,
      discount: 0,
      total: 347,
      currency: 'UAH',
      items: [
        { productId: products['milk-organic'],  quantity: 2, price: 42 },
        { productId: products['apples-golden'], quantity: 3, price: 45 },
        { productId: products['sourdough-bread'], quantity: 2, price: 65 },
      ],
    },
    {
      orderNumber: 'KRJ-2026-0002',
      status: OrderStatus.PROCESSING,
      customerId: customerIds[1],
      deliveryMode: DeliveryMode.PICKUP,
      paymentMethod: 'liqpay',
      paymentStatus: PaymentStatus.PAID,
      subtotal: 560,
      deliveryFee: 35,
      discount: 0,
      total: 595,
      currency: 'UAH',
      items: [
        { productId: products['chicken-fillet'],  quantity: 1, price: 180 },
        { productId: products['tomatoes-cherry'], quantity: 2, price: 85 },
        { productId: products['olive-oil-extra'], quantity: 1, price: 285 },
      ],
    },
  ];

  for (const order of ordersData) {
    const exists = await db.order.findFirst({ where: { storeId: store.id, orderNumber: order.orderNumber } });
    if (!exists) {
      const { items, ...orderRest } = order;
      await db.order.create({
        data: {
          ...orderRest,
          storeId: store.id,
          deliveryAddress: { city: 'Київ', country: 'UA' },
          items: { create: items },
        },
      });
    }
  }
  console.log('✅ Orders: 2');

  console.log('\n🎉 Krajina Fresh Market seed complete!');
  console.log(`   Store slug:   ${store.slug}`);
  console.log(`   Admin email:  ${adminEmail}`);
  console.log(`   Admin pass:   admin123`);
  console.log(`   Vertical:     FOOD_MARKET`);
  console.log(`   Products:     ${Object.keys(products).length}`);
  console.log(`   Categories:   ${Object.keys(categories).length}`);
  console.log(`\n💡 To switch: set STORE_SLUG=krajina in .env`);
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
