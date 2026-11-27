import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Plus, Minus, ShoppingCart, Leaf, Calendar, AlertTriangle, Clock, Truck, X,
} from 'lucide-react';
import { productService } from '../services/dataService';
import { useCart } from '../context/CartContext';
import config from '../data/config';

const FALLBACK_IMAGE = 'data:image/svg+xml,' + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
  <rect width="600" height="400" fill="#F6E2D3"/>
  <text x="300" y="190" text-anchor="middle" font-family="sans-serif" font-size="56" fill="#C76D45">🧁</text>
  <text x="300" y="240" text-anchor="middle" font-family="sans-serif" font-size="16" fill="#81766E">Image coming soon</text>
</svg>`);

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem, getItemQuantity, updateQuantity, removeItem } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [preOrderNote, setPreOrderNote] = useState('');
  const [imageOpen, setImageOpen] = useState(false);

  const cartQuantity = product ? getItemQuantity(product.id) : 0;

  useEffect(() => {
    setLoading(true);
    productService.getById(id).then((p) => {
      setProduct(p);
      setLoading(false);
    });
  }, [id]);

  useEffect(() => {
    if (!imageOpen) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setImageOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [imageOpen]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <div className="text-4xl mb-3">😕</div>
        <h2 className="text-xl font-bold text-dark mb-2">Product Not Found</h2>
        <p className="text-sm text-muted mb-4">
          This product may no longer be available.
        </p>
        <Link to="/menu" className="text-terracotta font-medium hover:underline">
          ← Back to Menu
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!product.available) return;
    addItem(product, quantity);
    setQuantity(1);
  };

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const categoryLabel =
    product.category.charAt(0).toUpperCase() +
    product.category.slice(1).replace('-', ' ');

  // Minimum date for pre-order (tomorrow)
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split('T')[0];

  return (
    <div className="min-h-screen max-w-4xl mx-auto">
      {/* Back button */}
      <div className="px-4 sm:px-6 py-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-muted hover:text-chocolate transition-colors"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 sm:px-6 pb-8">
        {/* Image */}
        <button
          type="button"
          onClick={() => setImageOpen(true)}
          className="relative aspect-square sm:aspect-[4/3] md:aspect-square rounded-2xl overflow-hidden bg-cream text-left"
          aria-label={`View larger image of ${product.name}`}
        >
          <img
            src={imgError ? FALLBACK_IMAGE : product.image}
            alt={product.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
          />
          {!product.available && (
            <div className="absolute inset-0 bg-dark/40 flex items-center justify-center">
              <span className="bg-white/90 text-dark font-semibold px-4 py-2 rounded-full">
                Currently Unavailable
              </span>
            </div>
          )}
          {discountPercent && (
            <span className="absolute top-3 left-3 bg-terracotta text-white text-sm font-bold px-3 py-1 rounded-full">
              {discountPercent}% OFF
            </span>
          )}
        </button>

        {/* Details */}
        <div className="flex flex-col">
          {/* Category badge */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-muted bg-cream px-2.5 py-1 rounded-full">
              {categoryLabel}
            </span>
            {product.isVeg && (
              <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                <Leaf size={10} />
                Veg
              </span>
            )}
            {product.isPreOrder && (
              <span className="flex items-center gap-1 text-xs text-chocolate bg-peach/50 px-2 py-1 rounded-full">
                <Calendar size={10} />
                Pre-order
              </span>
            )}
          </div>

          {/* Name */}
          <h1 className="text-2xl sm:text-3xl font-bold text-dark">{product.name}</h1>

          {/* Price */}
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-chocolate">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-lg text-muted line-through">₹{product.originalPrice}</span>
            )}
          </div>

          {/* Description */}
          <p className="text-muted text-sm leading-relaxed mt-4">{product.description}</p>

          {/* Allergy info */}
          {product.allergyInfo && (
            <div className="mt-4 flex items-start gap-2 p-3 bg-amber-50 border border-amber-100 rounded-xl text-sm">
              <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-medium text-amber-700">Allergy Info:</span>
                <span className="text-amber-600 ml-1">{product.allergyInfo}</span>
              </div>
            </div>
          )}

          {/* Pre-order fields for cakes */}
          {product.isPreOrder && product.available && (
            <div className="mt-4 p-4 bg-cream/50 border border-peach/30 rounded-xl space-y-3">
              <h3 className="text-sm font-semibold text-dark flex items-center gap-2">
                <Calendar size={14} className="text-terracotta" />
                Pre-order Details
              </h3>
              <div>
                <label className="block text-xs text-muted mb-1">
                  Preferred Delivery Date
                </label>
                <input
                  type="date"
                  value={deliveryDate}
                  min={minDateStr}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full px-3 py-2 border border-peach/30 rounded-lg text-sm text-dark bg-white focus:outline-none focus:ring-2 focus:ring-terracotta/30"
                />
              </div>
              <div>
                <label className="block text-xs text-muted mb-1">
                  Special Instructions (e.g. message on cake)
                </label>
                <textarea
                  value={preOrderNote}
                  onChange={(e) => setPreOrderNote(e.target.value)}
                  placeholder="e.g. 'Happy Birthday Rahul' on the cake"
                  rows={2}
                  className="w-full px-3 py-2 border border-peach/30 rounded-lg text-sm text-dark bg-white resize-none focus:outline-none focus:ring-2 focus:ring-terracotta/30"
                />
              </div>
            </div>
          )}

          {/* Delivery info */}
          <div className="mt-4 flex items-center gap-4 text-xs text-muted">
            <span className="flex items-center gap-1">
              <Truck size={12} className="text-terracotta" />
              {config.delivery.estimatedTime}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={12} className="text-terracotta" />
              Fresh daily
            </span>
          </div>

          {/* Quantity & Add to Cart */}
          {product.available && (
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-dark">Quantity:</span>
                <div className="flex items-center border border-peach/30 rounded-full overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-muted hover:bg-cream hover:text-dark transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-4 text-sm font-bold text-dark min-w-[40px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-muted hover:bg-cream hover:text-dark transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full flex items-center justify-center gap-2 bg-terracotta text-white font-semibold py-3.5 rounded-xl hover:bg-terracotta/90 active:scale-[0.98] transition-all shadow-lg shadow-terracotta/20"
              >
                <ShoppingCart size={18} />
                Add to Cart — ₹{product.price * quantity}
              </button>

              {cartQuantity > 0 && (
                <p className="text-center text-xs text-muted">
                  ✓ {cartQuantity} already in cart
                </p>
              )}
            </div>
          )}

          {!product.available && (
            <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl text-center">
              <p className="text-sm text-red-600 font-medium">This item is currently unavailable</p>
              <p className="text-xs text-red-400 mt-1">Check back later or browse other items</p>
            </div>
          )}
        </div>
      </div>

      {imageOpen && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 p-3 animate-fade-in sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={`Large view of ${product.name}`}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setImageOpen(false);
          }}
        >
          <button
            type="button"
            onClick={() => setImageOpen(false)}
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-dark shadow-lg"
            aria-label="Close image"
          >
            <X size={22} />
          </button>
          <img
            src={imgError ? FALLBACK_IMAGE : product.image}
            alt={product.name}
            className="max-h-[92dvh] max-w-[94vw] object-contain rounded-lg shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}
