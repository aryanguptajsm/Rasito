import { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import StickyCartBar from './components/StickyCartBar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';

function AppLayout() {
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen bg-cream">
      {!isAdmin && <Header onSearch={setSearchQuery} />}

      <main className="flex-1 pb-16 md:pb-0">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>

      {!isAdmin && <Footer />}
      {!isAdmin && <StickyCartBar />}
      {!isAdmin && <BottomNav />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <AppLayout />
      </CartProvider>
    </BrowserRouter>
  );
}
