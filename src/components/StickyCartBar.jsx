import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { configService } from '../services/dataService';

export default function StickyCartBar() {
  const { items, itemCount, subtotal } = useCart();

  if (itemCount === 0) return null;

  const deliveryFee = configService.getDeliveryFee(subtotal);
  const total = subtotal + deliveryFee;

  return (
    <div className="md:hidden fixed bottom-16 left-0 right-0 z-40 px-3 pb-2 animate-slide-up">
      <Link
        to="/cart"
        className="flex items-center justify-between bg-chocolate text-white rounded-2xl px-4 py-3 shadow-lg hover:bg-chocolate/90 transition-all active:scale-[0.98]"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <ShoppingBag size={20} />
            <span className="absolute -top-1.5 -right-1.5 bg-terracotta text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
              {itemCount}
            </span>
          </div>
          <div>
            <p className="text-xs text-white/70">
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </p>
            <p className="text-sm font-bold">₹{total}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-sm font-semibold">
          View Cart
          <ArrowRight size={16} />
        </div>
      </Link>
    </div>
  );
}
