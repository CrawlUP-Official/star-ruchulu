import { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import StickyCrawlupBar from './components/StickyCrawlupBar';
import WhatsAppFloat from './components/WhatsAppFloat';
import ScrollToTop from './components/ScrollToTop';

import Home from './pages/Home';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import About from './pages/About';
import Contact from './pages/Contact';

const ProductDetails = lazy(() => import('./pages/ProductDetails'));

// Admin Imports
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminSubscriptions from './pages/admin/AdminSubscriptions';
import AdminContactMessages from './pages/admin/AdminContactMessages';
import AdminSettings from './pages/admin/AdminSettings';

const Loader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-gray-200 border-t-[var(--color-primary-green)] rounded-full animate-spin"></div>
  </div>
);

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin.in');

  if (isAdminRoute) {
    return (
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/admin.in/login" element={<AdminLogin />} />
          <Route path="/admin.in" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="subscriptions" element={<AdminSubscriptions />} />
            <Route path="contact-messages" element={<AdminContactMessages />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative pb-8">
      <ScrollToTop />
      <Navbar />
      <main className="flex-grow">
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/shop/:category" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <WhatsAppFloat />
      <StickyCrawlupBar />
    </div>
  );
}

export default App;
