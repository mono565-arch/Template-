import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import AdminLayout from '../layouts/AdminLayout'
import Home from '../pages/Home'
import About from '../pages/About'
import Menu from '../pages/Menu'
import Contact from '../pages/Contact'
import Cart from '../pages/Cart'
import Checkout from '../pages/Checkout'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Profile from '../pages/Profile'
import Admin from '../pages/Admin'
import AdminOrders from '../pages/AdminOrders'
import AdminProducts from '../pages/AdminProducts'
import AdminDeals from '../pages/AdminDeals'
import AdminReviews from '../pages/AdminReviews'
import AdminCoupons from '../pages/AdminCoupons'
import AdminSettings from '../pages/AdminSettings'
import AdminMessages from '../pages/AdminMessages'
import AdminLogin from '../pages/AdminLogin'
import ChangePassword from '../pages/ChangePassword'
import NotFound from '../pages/NotFound'

const isUserLoggedIn = () => {
  return localStorage.getItem('pizza_saucy_user') !== null
}

const isAdminLoggedIn = () => {
  return localStorage.getItem('pizza_saucy_admin_auth') === 'true'
}

// Customer auth guard
const RequireAuth = () => {
  return isUserLoggedIn() ? <Outlet /> : <Navigate to="/login" replace />
}

// Redirect logged-in users away from login/register
const RedirectIfAuth = () => {
  return isUserLoggedIn() ? <Navigate to="/profile" replace /> : <Outlet />
}

// Admin auth guard
const RequireAdminAuth = () => {
  return isAdminLoggedIn() ? <Outlet /> : <Navigate to="/admin-login" replace />
}

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        
        {/* Auth pages - redirect to profile if already logged in */}
        <Route element={<RedirectIfAuth />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Protected customer routes */}
        <Route element={<RequireAuth />}>
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      <Route path="/admin-login" element={<AdminLogin />} />

      <Route element={<RequireAdminAuth />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/deals" element={<AdminDeals />} />
          <Route path="/admin/reviews" element={<AdminReviews />} />
          <Route path="/admin/messages" element={<AdminMessages />} />
          <Route path="/admin/coupons" element={<AdminCoupons />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/change-password" element={<ChangePassword />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes