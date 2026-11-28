/**
 * ============================================================
 * RESTRO — CENTRAL PRODUCT DATA (SAMPLE / DEMO)
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
];

let _nextId = 1;
const id = () => String(_nextId++);

const CAKE_ASSETS = [
  { name: 'Blue and White Rose Cake', price: 250, folder: '250rs cake', file: 'Blue and White Rose Cake.png' },
  { name: 'Elegant Red-Trimmed Floral Cake on Cream Background', price: 250, folder: '250rs cake', file: 'Elegant Red-Trimmed Floral Cake on Cream Background.png' },
  { name: 'Elegant Yellow-Piped Rose Celebration Cake', price: 250, folder: '250rs cake', file: 'Elegant Yellow-Piped Rose Celebration Cake.png' },
  { name: 'Pastel Rose Celebration Cake', price: 250, folder: '250rs cake', file: 'Pastel Rose Celebration Cake.png' },
  { name: 'Pastel Yellow Rose Cake with Cherry Accents', price: 250, folder: '250rs cake', file: 'Pastel Yellow Rose Cake with Cherry Accents.png' },
  { name: 'Bright Yellow Drip Cake with Floral Icing', price: 300, folder: '300rs cake', file: 'Bright Yellow Drip Cake with Floral Icing.png' },
  { name: 'Chocolate Swirl Cake with Cherry Accents', price: 300, folder: '300rs cake', file: 'Chocolate Swirl Cake with Cherry Accents.png' },
  { name: 'Elegant Coffee Buttercream Rose Cake', price: 300, folder: '300rs cake', file: 'Elegant Coffee Buttercream Rose Cake.png' },
  { name: 'Elegant Coffee Chocolate Mousse Cake', price: 300, folder: '300rs cake', file: 'Elegant Coffee Chocolate Mousse Cake.png' },
  { name: 'Elegant Happy Anniversary Cake', price: 300, folder: '300rs cake', file: 'Elegant Happy Anniversary Cake.png' },
  { name: 'Glossy Floral Swirl Celebration Cake', price: 300, folder: '300rs cake', file: 'Glossy Floral Swirl Celebration Cake.png' },
  { name: 'Pastel Pink Rose Cake on Gold Board', price: 300, folder: '300rs cake', file: 'Pastel Pink Rose Cake on Gold Board.png' },
  { name: 'Pink Rosette Cake on Gold Board', price: 300, folder: '300rs cake', file: 'Pink Rosette Cake on Gold Board.png' },
  { name: 'Red and Orange Rosette Celebration Cake', price: 300, folder: '300rs cake', file: 'Red and Orange Rosette Celebration Cake.png' },
  { name: 'Vibrant Pink Rose Cake', price: 300, folder: '300rs cake', file: 'Vibrant Pink Rose Cake.png' },
  { name: 'Vibrant Red and Pink Floral Celebration Cake', price: 300, folder: '300rs cake', file: 'Vibrant Red and Pink Floral Celebration Cake.png' },
  { name: 'Cheerful Bunny Garden Celebration Cake', price: 350, folder: '350rs cake', file: 'Cheerful Bunny Garden Celebration Cake.png' },
  { name: 'Cherry-Topped Chocolate Drip Cake', price: 350, folder: '350rs cake', file: 'Cherry-Topped Chocolate Drip Cake.png' },
  { name: 'Chocolate Drip Cherry Cream Cake', price: 350, folder: '350rs cake', file: 'Chocolate Drip Cherry Cream Cake.png' },
  { name: 'Elegant Black-and-White Chocolate Rose Cake', price: 350, folder: '350rs cake', file: 'Elegant Black-and-White Chocolate Rose Cake.png' },
  { name: 'Elegant Blue Chocolate Drip Birthday Cake', price: 350, folder: '350rs cake', file: 'Elegant Blue Chocolate Drip Birthday Cake.png' },
  { name: 'Elegant Coffee Cream Chocolate Cake', price: 350, folder: '350rs cake', file: 'Elegant Coffee Cream Chocolate Cake.png' },
  { name: 'Glossy Black Forest Cake with Cherry', price: 350, folder: '350rs cake', file: 'Glossy Black Forest Cake with Cherry.png' },
  { name: 'Glossy Cherry Caramel Drip Cake', price: 350, folder: '350rs cake', file: 'Glossy Cherry Caramel Drip Cake.png' },
  { name: 'Glossy Chocolate Rose Cake', price: 350, folder: '350rs cake', file: 'Glossy Chocolate Rose Cake.png' },
  { name: 'Glossy Chocolate Thanksgiving Cake', price: 350, folder: '350rs cake', file: 'Glossy Chocolate Thanksgiving Cake.png' },
  { name: 'Half-and-Half Red Velvet Celebration Cake', price: 350, folder: '350rs cake', file: 'Half-and-Half Red Velvet Celebration Cake.png' },
  { name: 'Pink Rose Ganache Drip Cake', price: 350, folder: '350rs cake', file: 'Pink Rose Ganache Drip Cake.png' },
  { name: 'Snowman Carnival Celebration Cake', price: 350, folder: '350rs cake', file: 'Snowman Carnival Celebration Cake.png' },
  { name: 'Vibrant Chocolate Birthday Cake', price: 350, folder: '350rs cake', file: 'Vibrant Chocolate Birthday Cake.png' },
  { name: 'Celebration Chocolate Cake', price: 350, folder: '350rs cake', file: 'cbcb0420-2b2d-424b-a8fe-ccadf89d83c3.jpg' },
  { name: 'Barbie Doll Ruffle Cake on Gold Board', price: 400, folder: '400rs cakes', file: 'Barbie Doll Ruffle Cake on Gold Board.png' },
  { name: 'Butterfly Heart Orange Drip Cake', price: 400, folder: '400rs cakes', file: 'Butterfly Heart Orange Drip Cake.png' },
  { name: 'Chocolate Ganache Cherry Cookie Cake', price: 400, folder: '400rs cakes', file: 'Chocolate Ganache Cherry Cookie Cake.png' },
  { name: 'Colourful Chocolate Drizzle Cake', price: 400, folder: '400rs cakes', file: 'Colourful Chocolate Drizzle Cake.png' },
  { name: 'Colourful Chocolate Mirror-Glaze Cake', price: 400, folder: '400rs cakes', file: 'Colourful Chocolate Mirror-Glaze Cake.png' },
  { name: 'Decadent Chocolate Berry Drip Cake', price: 400, folder: '400rs cakes', file: 'Decadent Chocolate Berry Drip Cake.png' },
  { name: 'Elegant Butterfly Rose Celebration Cake', price: 400, folder: '400rs cakes', file: 'Elegant Butterfly Rose Celebration Cake.png' },
  { name: 'Elegant Gold-Trimmed Floral Celebration Cake', price: 400, folder: '400rs cakes', file: 'Elegant Gold-Trimmed Floral Celebration Cake.png' },
  { name: 'Glossy Chocolate Cake with Cherry and Shards', price: 400, folder: '400rs cakes', file: 'Glossy Chocolate Cake with Cherry and Shards.png' },
  { name: 'Glossy Chocolate Sprinkle Celebration Cake', price: 400, folder: '400rs cakes', file: 'Glossy Chocolate Sprinkle Celebration Cake.png' },
  { name: 'Glossy Yellow Heart Cake', price: 400, folder: '400rs cakes', file: 'Glossy Yellow Heart Cake.png' },
  { name: 'Glossy Yellow Pineapple Cherry Cake', price: 400, folder: '400rs cakes', file: 'Glossy Yellow Pineapple Cherry Cake.png' },
  { name: 'Mango-Glazed Chocolate Rose Cake', price: 400, folder: '400rs cakes', file: 'Mango-Glazed Chocolate Rose Cake.png' },
  { name: 'Pastel Pearl Rosette Celebration Cake', price: 400, folder: '400rs cakes', file: 'Pastel Pearl Rosette Celebration Cake.png' },
  { name: 'Peacock Feather Yellow Glaze Cake', price: 400, folder: '400rs cakes', file: 'Peacock Feather Yellow Glaze Cake.png' },
  { name: 'Red Roses and Gold Cake Lettering', price: 400, folder: '400rs cakes', file: 'Red Roses and Gold Cake Lettering.png' },
  { name: 'Romantic Chocolate Cake with Pink Roses', price: 400, folder: '400rs cakes', file: 'Romantic Chocolate Cake with Pink Roses.png' },
  { name: 'Vibrant Mango Birthday Cake', price: 400, folder: '400rs cakes', file: 'Vibrant Mango Birthday Cake.png' },

];

const CAKE_PRODUCTS = CAKE_ASSETS.map((cake) => ({
  id: id(),
  name: cake.name,
  category: 'cakes',
  price: cake.price,
  description: `${cake.name} - a freshly prepared celebration cake.`,
  image: `/${cake.folder ? `${cake.folder}/` : ''}${cake.file}`,
  available: true,
  isVeg: true,
  isBestseller: false,
  isPreOrder: true,
}));

/**
 * Each product follows this shape
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
    name: 'Samosa',
    category: 'snacks',
    price: 15,
    description: 'Crispy, golden samosa filled with spiced potato and paneer, onion, peas. A timeless classic.',
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
 
  ...CAKE_PRODUCTS,
].filter((product) => product.price >= 250);

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
