import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, ArrowRight, Info, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { configService } from '../services/dataService';
import config from '../data/config';

const FALLBACK_IMAGE = 'data:image/svg+xml,' + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80">
  <rect width="80" height="80" fill="#F6E2D3" rx="8"/>
  <text x="40" y="48" text-anchor="middle" font-family="sans-serif" font-size="24" fill="#C76D45">🧁</text>
</svg>`);

export default function CartPage() {
  const { items, itemCount, subtotal, removeItem, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();

  const deliveryFee = configService.getDeliveryFee(subtotal);
  const total = subtotal + deliveryFee;
  const minimumOrder = configService.getMinimumOrder();
  const belowMinimum = minimumOrder > 0 && subtotal < minimumOrder;
  const freeDeliveryThreshold = config.delivery.freeAbove;

  if (itemCount === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <div className="bg-cream p-6 rounded-full mb-5">
          <ShoppingBag size={48} className="text-muted" />
        </div>
        <h2 className="text-xl font-bold text-dark mb-2">Your cart is empty</h2>
        <p className="text-sm text-muted max-w-xs mb-6">
          Looks like you haven't added anything yet. Browse our menu to find something delicious!
        </p>
        <Link
          to="/menu"
          className="inline-flex items-center gap-2 bg-terracotta text-white font-semibold px-6 py-3 rounded-full hover:bg-terracotta/90 transition-all"
        >
          Explore Menu
          <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-3xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 rounded-lg hover:bg-cream text-muted hover:text-dark transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-dark">Your Cart</h1>
            <p className="text-xs text-muted">{itemCount} {itemCount === 1 ? 'item' : 'items'}</p>
          </div>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-red-500 hover:text-red-600 font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
        >
          Clear all
        </button>
      </div>

      {/* Cart Items */}
      <div className="space-y-3 mb-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 bg-white rounded-xl border border-peach/20 p-3 shadow-sm"
          >
            <Link to={`/product/${item.id}`} className="shrink-0">
              <img
                src={item.image}
                alt={item.name}
                onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover bg-cream"
              />
            </Link>
            <div className="flex-1 min-w-0">
              <Link
                to={`/product/${item.id}`}
                className="font-semibold text-dark text-sm hover:text-terracotta transition-colors line-clamp-1"
              >
                {item.name}
              </Link>
              <p className="text-xs text-muted mt-0.5">₹{item.price} each</p>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center border border-peach/30 rounded-full overflow-hidden">
                  <button
                    onClick={() =>
                      item.quantity <= 1
                        ? removeItem(item.id)
                        : updateQuantity(item.id, item.quantity - 1)
                    }
                    className="px-2.5 py-1 text-muted hover:bg-cream hover:text-dark transition-colors"
                    aria-label={`Decrease ${item.name} quantity`}
                  >
                    <Minus size={14} />
                  </button>
                  <span className="px-3 text-xs font-bold text-dark min-w-[28px] text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-2.5 py-1 text-muted hover:bg-cream hover:text-dark transition-colors"
                    aria-label={`Increase ${item.name} quantity`}
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-chocolate text-sm">
                    ₹{item.price * item.quantity}
                  </span>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1.5 rounded-lg text-muted hover:text-red-500 hover:bg-red-50 transition-colors"
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Minimum order notice */}
      {belowMinimum && (
        <div className="flex items-start gap-2 p-3 mb-4 bg-amber-50 border border-amber-100 rounded-xl text-sm">
          <AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />
          <p className="text-amber-700">
            Minimum order amount is <strong>₹{minimumOrder}</strong>. Add ₹{minimumOrder - subtotal} more to proceed.
          </p>
        </div>
      )}

      {/* Free delivery nudge */}
      {freeDeliveryThreshold && subtotal < freeDeliveryThreshold && subtotal > 0 && (
        <div className="flex items-start gap-2 p-3 mb-4 bg-green-50 border border-green-100 rounded-xl text-sm">
          <Info size={16} className="text-green-500 shrink-0 mt-0.5" />
          <p className="text-green-700">
            Add ₹{freeDeliveryThreshold - subtotal} more for <strong>free delivery</strong>!
          </p>
        </div>
      )}

      {/* Price Summary */}
      <div className="bg-white rounded-xl border border-peach/20 p-4 shadow-sm space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted">Subtotal</span>
          <span className="text-dark font-medium">₹{subtotal}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted">Delivery Fee</span>
          <span className={deliveryFee === 0 ? 'text-green-600 font-medium' : 'text-dark font-medium'}>
            {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
          </span>
        </div>
        <div className="border-t border-peach/20 pt-2 flex justify-between">
          <span className="font-semibold text-dark">Total</span>
          <span className="font-bold text-lg text-chocolate">₹{total}</span>
        </div>
      </div>

      {/* Checkout Button */}
      <div className="mt-4 mb-20 md:mb-4">
        <Link
          to={belowMinimum ? '#' : '/checkout'}
          onClick={(e) => belowMinimum && e.preventDefault()}
          className={`w-full flex items-center justify-center gap-2 font-semibold py-3.5 rounded-xl transition-all ${
            belowMinimum
              ? 'bg-muted/30 text-muted cursor-not-allowed'
              : 'bg-terracotta text-white hover:bg-terracotta/90 active:scale-[0.98] shadow-lg shadow-terracotta/20'
          }`}
        >
          Proceed to Checkout
          <ArrowRight size={16} />
        </Link>
        <Link
          to="/menu"
          className="w-full flex items-center justify-center gap-1 mt-3 text-sm text-terracotta font-medium hover:underline"
        >
          <ArrowLeft size={14} />
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
