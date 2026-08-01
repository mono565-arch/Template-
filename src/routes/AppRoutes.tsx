import { Routes, Route } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import AdminLayout from '../layouts/AdminLayout'
import Home from '../pages/Home'
import About from '../pages/About'
import Contact from '../pages/Contact'
import Menu from '../pages/Menu'
import Cart from '../pages/Cart'
import Checkout from '../pages/Checkout'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Profile from '../pages/Profile'
import AdminLogin from '../pages/AdminLogin'
import Admin from '../pages/Admin'
import AdminProducts from '../pages/AdminProducts'
import AdminCategories from '../pages/AdminCategories'
import AdminOrders from '../pages/AdminOrders'
import AdminCoupons from '../pages/AdminCoupons'
import AdminReviews from '../pages/AdminReviews'
import AdminSettings from '../pages/AdminSettings'
import NotFound from '../pages/NotFound'

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes with MainLayout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* Admin login - no layout */}
      <Route path="/admin-login" element={<AdminLogin />} />

      {/* Admin routes with AdminLayout */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Admin />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="coupons" element={<AdminCoupons />} />
        <Route path="reviews" element={<AdminReviews />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* 404 - no layout */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes
