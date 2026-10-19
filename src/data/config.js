/**
 * ============================================================
 * GAONBITES — CONFIGURATION
 * ============================================================
 * Business settings, delivery config, and WhatsApp configuration.
 * All values are editable from this file.
 *
 * ⚠️  DEMO MODE — Update these values before going live.
 * ============================================================
 */

const config = {
  /** Business name */
  businessName: 'GaonBites',

  /** Business tagline */
  tagline: 'Fresh Bakery Treats, Delivered to Your Door.',

  /** Sub-tagline */
  subTagline: 'Cakes, pastries, patties and more — made easy to order locally.',

  /**
   * WhatsApp business phone number (with country code, no + prefix).
   * Set to empty string '' if not configured yet.
   * Example: '919876543210' for +91 98765 43210
   */
  whatsappNumber: '917985876273',

  /** Delivery settings */
  delivery: {
    /** Delivery fee in ₹ (set 0 for free delivery) */
    fee: 20,
    /** Free delivery above this amount (set null to disable) */
    freeAbove: 300,
    /** Minimum order amount (set 0 to disable) */
    minimumOrder: 50,
    /** Estimated delivery window text */
    estimatedTime: '30–60 minutes',
    /** Service areas */
    areas: [
      'Village Centre',
      'Near Market Road',
      'School Area',
      'Temple Road',
      'Railway Station Area',
    ],
  },

  /** Opening hours (display only) */
  openingHours: {
    weekdays: '8:00 AM – 9:00 PM',
    weekends: '9:00 AM – 10:00 PM',
  },

  /** Payment options */
  paymentOptions: [
    { id: 'cod', label: 'Cash on Delivery', enabled: true },
    { id: 'pay-at-delivery', label: 'Pay at Delivery (UPI/Cash)', enabled: true },
  ],

  /** Cancellation policy */
  cancellationPolicy:
    'Orders can be cancelled within 5 minutes of placing. After that, please contact us on WhatsApp. Pre-order cakes require 24-hour notice for cancellation.',

  /** Order confirmation flow */
  orderConfirmationNote:
    'Sending your order via WhatsApp is a request. Your order is confirmed only after the bakery reviews availability and accepts it. You will receive a confirmation message on WhatsApp.',

  /**
   * Demo mode flag
   * When true, shows demo banners and uses local data.
   * Set to false when backend (Supabase) is connected.
   */
  isDemoMode: true,

  /** Admin settings — demo only, no real auth */
  admin: {
    /** Admin route path */
    path: '/admin',
    /** Demo admin note */
    demoNote:
      'This admin interface is for demonstration only. It does not have real authentication or server-side authorization. Do not use this for production without implementing proper Supabase authentication and Row Level Security.',
  },
};

export default config;
