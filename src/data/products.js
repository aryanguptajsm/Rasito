/**
 * ============================================================
 * RASITO — CENTRAL PRODUCT DATA (SAMPLE / DEMO)
 * ============================================================
 * All product names, prices, images, categories, and availability
 * are editable from this single file.
 *
 * ⚠️  SAMPLE DATA — These prices and descriptions are for
 *     demonstration only and do not reflect verified market prices.
 *
 * When Supabase is integrated, this file will be replaced by
 * database queries through the service layer (see /services/).
 * ============================================================
 */

export const CATEGORIES = [
  { id: 'cakes', label: 'Cakes', emoji: '🎂' },
  { id: 'pastries', label: 'Pastries', emoji: '🥐' },
  { id: 'patties', label: 'Patties', emoji: '🥟' },
  { id: 'cream-rolls', label: 'Cream Rolls', emoji: '🧁' },
  { id: 'burgers', label: 'Burgers', emoji: '🍔' },
  { id: 'cookies', label: 'Cookies', emoji: '🍪' },
  { id: 'snacks', label: 'Snacks', emoji: '🥨' },
];

let _nextId = 1;
const id = () => String(_nextId++);

/**
 * Each product follows this shape:
 * {
 *   id: string,
 *   name: string,
 *   category: string (must match a CATEGORIES id),
 *   price: number (in ₹),
 *   originalPrice?: number (only when a genuine discount exists),
 *   description: string,
 *   image: string (URL or local path),
 *   available: boolean,
 *   isVeg: boolean | null (null = not verified),
 *   allergyInfo?: string (only when supplied and verified by bakery),
 *   isBestseller?: boolean,
 *   isPreOrder?: boolean (for cakes that need advance booking),
 *   minOrderQty?: number,
 * }
 */

export const PRODUCTS = [
  {
    id: id(),
    name: 'Chocolate Pastry',
    category: 'pastries',
    price: 60,
    description: 'Rich, layered chocolate pastry with smooth ganache topping. A classic favorite for every occasion.',
    image: '/images/chocolate-pastry.jpg',
    available: true,
    isVeg: true,
    isBestseller: true,
  },
  {
    id: id(),
    name: 'Veg Patties',
    category: 'patties',
    price: 25,
    description: 'Crispy golden patties filled with spiced mixed vegetables. Perfect for a quick snack.',
    image: '/images/veg-patties.jpg',
    available: true,
    isVeg: true,
    isBestseller: true,
  },
  {
    id: id(),
    name: 'Cream Roll',
    category: 'cream-rolls',
    price: 30,
    description: 'Light, flaky pastry roll filled with fresh vanilla cream. Melt-in-your-mouth goodness.',
    image: '/images/cream-roll.jpg',
    available: true,
    isVeg: true,
    isBestseller: false,
  },
  {
    id: id(),
    name: 'Veg Burger',
    category: 'burgers',
    price: 70,
    description: 'Soft bun loaded with a crispy veggie patty, fresh lettuce, tomato, and special sauce.',
    image: '/images/veg-burger.jpg',
    available: true,
    isVeg: true,
    isBestseller: true,
  },
  {
    id: id(),
    name: 'Black Forest Cake',
    category: 'cakes',
    price: 450,
    description: 'Indulgent layers of chocolate sponge, whipped cream, and cherries. Perfect for celebrations.',
    image: '/images/black-forest-cake.jpg',
    available: true,
    isVeg: true,
    isBestseller: true,
    isPreOrder: true,
  },
  {
    id: id(),
    name: 'Cookies Pack',
    category: 'cookies',
    price: 50,
    description: 'Assorted butter cookies in a convenient pack. Crunchy, buttery, and irresistible.',
    image: '/images/cookies-pack.jpg',
    available: true,
    isVeg: true,
    isBestseller: false,
  },
  {
    id: id(),
    name: 'Pineapple Pastry',
    category: 'pastries',
    price: 55,
    description: 'Light sponge layered with pineapple cream and topped with a glazed pineapple slice.',
    image: '/images/pineapple-pastry.jpg',
    available: true,
    isVeg: true,
    isBestseller: false,
  },
  {
    id: id(),
    name: 'Paneer Patties',
    category: 'patties',
    price: 30,
    description: 'Flaky puff pastry with a savory paneer and spice filling. Freshly baked to order.',
    image: '/images/paneer-patties.jpg',
    available: true,
    isVeg: true,
    isBestseller: false,
  },
  {
    id: id(),
    name: 'Chocolate Cream Roll',
    category: 'cream-rolls',
    price: 35,
    description: 'Delicate pastry roll filled with rich chocolate cream and dusted with cocoa.',
    image: '/images/chocolate-cream-roll.jpg',
    available: true,
    isVeg: true,
    isBestseller: false,
  },
  {
    id: id(),
    name: 'Vanilla Cake',
    category: 'cakes',
    price: 400,
    originalPrice: 450,
    description: 'Classic vanilla sponge cake with buttercream frosting. Simple elegance for any celebration.',
    image: '/images/vanilla-cake.jpg',
    available: true,
    isVeg: true,
    isBestseller: false,
    isPreOrder: true,
  },
  {
    id: id(),
    name: 'Choco Chip Cookies',
    category: 'cookies',
    price: 60,
    description: 'Loaded with real chocolate chips. Soft in the center, crisp at the edges.',
    image: '/images/choco-chip-cookies.jpg',
    available: true,
    isVeg: true,
    isBestseller: true,
  },
  {
    id: id(),
    name: 'Aloo Burger',
    category: 'burgers',
    price: 50,
    description: 'Budget-friendly burger with a spiced aloo tikki patty and tangy chutney.',
    image: '/images/aloo-burger.jpg',
    available: true,
    isVeg: true,
    isBestseller: false,
  },
  {
    id: id(),
    name: 'Red Velvet Cake',
    category: 'cakes',
    price: 550,
    description: 'Stunning red velvet layers with cream cheese frosting. A showstopper for special moments.',
    image: '/images/red-velvet-cake.jpg',
    available: false,
    isVeg: true,
    isBestseller: false,
    isPreOrder: true,
  },
  {
    id: id(),
    name: 'Samosa',
    category: 'snacks',
    price: 15,
    description: 'Crispy, golden samosa filled with spiced potato and peas. A timeless classic.',
    image: '/images/samosa.jpg',
    available: true,
    isVeg: true,
    isBestseller: true,
  },
  {
    id: id(),
    name: 'Bread Pakora',
    category: 'snacks',
    price: 20,
    description: 'Stuffed bread slices dipped in spiced gram flour batter and deep-fried until golden.',
    image: '/images/bread-pakora.jpg',
    available: true,
    isVeg: true,
    isBestseller: false,
  },
  {
    id: id(),
    name: 'Chocolete mocha cake ',
    category: 'cakes',
    price: 480,
    description: 'Rich butterscotch sponge with caramel drizzle and crunchy praline topping.',
    image: '/public/Chocoletemocha.png',
    available: true,
    isVeg: true,
    isBestseller: false,
    isPreOrder: true,
  },
];

/** Helper: get products by category */
export const getProductsByCategory = (categoryId) =>
  PRODUCTS.filter((p) => p.category === categoryId);

/** Helper: get bestsellers */
export const getBestsellers = () =>
  PRODUCTS.filter((p) => p.isBestseller && p.available);

/** Helper: get product by ID */
export const getProductById = (productId) =>
  PRODUCTS.find((p) => p.id === productId) || null;

/** Helper: search products */
export const searchProducts = (query) => {
  const q = query.toLowerCase().trim();
  if (!q) return PRODUCTS;
  return PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
  );
};

/** Helper: get pre-order cakes */
export const getPreOrderCakes = () =>
  PRODUCTS.filter((p) => p.isPreOrder && p.available);
