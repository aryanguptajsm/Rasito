/**
 * ============================================================
 * RASITO — SERVICE LAYER
 * ============================================================
 * Abstraction layer for data access.
 * Currently uses local mock data from /data/products.js.
 *
 * When Supabase is integrated, replace these functions with
 * real database queries. The component layer won't need changes
 * because it calls these service functions, not data directly.
 * ============================================================
 */

import {
  PRODUCTS,
  CATEGORIES,
  getProductById,
  getProductsByCategory,
  getBestsellers,
  searchProducts,
  getPreOrderCakes,
} from '../data/products';
import config from '../data/config';

// ─── Product Services ──────────────────────────────────────

export const productService = {
  getAll: () => Promise.resolve(PRODUCTS.filter((p) => p.available)),
  getAllIncludingUnavailable: () => Promise.resolve([...PRODUCTS]),
  getById: (id) => Promise.resolve(getProductById(id)),
  getByCategory: (categoryId) => Promise.resolve(getProductsByCategory(categoryId)),
  getBestsellers: () => Promise.resolve(getBestsellers()),
  search: (query) => Promise.resolve(searchProducts(query)),
  getCategories: () => Promise.resolve([...CATEGORIES]),
  getPreOrderCakes: () => Promise.resolve(getPreOrderCakes()),
};

// ─── Order Services ────────────────────────────────────────

/**
 * Order statuses:
 * 'pending'    → Sent via WhatsApp, not yet confirmed
 * 'accepted'   → Bakery confirmed
 * 'preparing'  → Being prepared
 * 'out'        → Out for delivery
 * 'delivered'  → Delivered
 * 'cancelled'  → Cancelled
 */

const ORDER_STORAGE_KEY = 'gaonbites_orders';

const getStoredOrders = () => {
  try {
    return JSON.parse(localStorage.getItem(ORDER_STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
};

const saveOrders = (orders) => {
  localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orders));
};

export const orderService = {
  /** Create a new order (local demo — stores in localStorage) */
  create: (orderData) => {
    const order = {
      id: `GB-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
      ...orderData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const orders = getStoredOrders();
    orders.unshift(order);
    saveOrders(orders);
    return Promise.resolve(order);
  },

  /** Get all orders */
  getAll: () => Promise.resolve(getStoredOrders()),

  /** Get order by ID */
  getById: (orderId) => {
    const orders = getStoredOrders();
    return Promise.resolve(orders.find((o) => o.id === orderId) || null);
  },

  /** Update order status (admin demo) */
  updateStatus: (orderId, status) => {
    const orders = getStoredOrders();
    const idx = orders.findIndex((o) => o.id === orderId);
    if (idx === -1) return Promise.reject(new Error('Order not found'));
    orders[idx].status = status;
    orders[idx].updatedAt = new Date().toISOString();
    saveOrders(orders);
    return Promise.resolve(orders[idx]);
  },
};

// ─── WhatsApp Service ───────────────────────────────────

export const whatsappService = {
  /** Check if WhatsApp number is configured */
  isConfigured: () => Boolean(config.whatsappNumber && config.whatsappNumber.trim()),

  /**
   * Generate a concise WhatsApp order message
   * @param {Object} params - { items, subtotal, deliveryFee, total, customer }
   */
  generateMessage: ({ items, subtotal, deliveryFee, total, customer }) => {
    const lines = [
      `*Order Request — ${config.businessName}*`,
      '',
      '*Items*',
      ...items.map((item) =>
        `- ${item.name} × ${item.quantity} — ₹${item.price * item.quantity}`
      ),
      '',
      `Subtotal: ₹${subtotal}`,
      `Delivery: ${deliveryFee > 0 ? `₹${deliveryFee}` : 'Free'}`,
      `*Total: ₹${total}*`,
      '',
      '*Customer*',
      `Name: ${customer.name}`,
      `Phone: ${customer.phone}`,
      `Village: ${customer.village}`,
      `Address: ${customer.address}`,
      customer.landmark ? `Landmark: ${customer.landmark}` : '',
      customer.locationCoordinates
        ? `GPS pin: https://maps.google.com/?q=${customer.locationCoordinates}`
        : '',
      customer.instructions ? `Delivery instructions: ${customer.instructions}` : '',
      customer.paymentMethod ? `Payment: ${customer.paymentMethod}` : '',
      customer.deliveryDate ? `Preferred delivery date: ${customer.deliveryDate}` : '',
      customer.orderNotes ? `Order notes: ${customer.orderNotes}` : '',
    ].filter(Boolean);

    return lines.join('\n');
  },

  /** Open WhatsApp with prefilled message */
  openWhatsApp: (message) => {
    if (!whatsappService.isConfigured()) {
      return {
        success: false,
        error: `WhatsApp business number is not configured. Please update the whatsappNumber in the configuration file (src/data/config.js) with your business WhatsApp number including country code (e.g., "919876543210").`,
      };
    }
    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${config.whatsappNumber}?text=${encoded}`;
    window.open(url, '_blank');
    return { success: true, url };
  },
};

// ─── Config Service ────────────────────────────────────────

export const configService = {
  getConfig: () => Promise.resolve({ ...config }),
  getDeliveryFee: (subtotal) => {
    if (config.delivery.freeAbove && subtotal >= config.delivery.freeAbove) return 0;
    return config.delivery.fee;
  },
  getMinimumOrder: () => config.delivery.minimumOrder,
  getPaymentOptions: () => config.paymentOptions.filter((p) => p.enabled),
  getDeliveryAreas: () => [...config.delivery.areas],
};
