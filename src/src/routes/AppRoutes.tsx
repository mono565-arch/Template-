import { Routes, Route, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
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
import AdminMessages from '../pages/AdminMessages'
import AdminCoupons from '../pages/AdminCoupons'
import AdminReviews from '../pages/AdminReviews'
import AdminSettings from '../pages/AdminSettings'
import NotFound from '../pages/NotFound'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate()
  const auth = localStorage.getItem('pizzaSaucyAuth')

  useEffect(() => {
    if (!auth) navigate('/login')
  }, [auth, navigate])

  if (!auth) return null
  return <>{children}</>
}

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      </Route>

      <Route path="/admin-login" element={<AdminLogin />} />

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Admin />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="messages" element={<AdminMessages />} />
        <Route path="coupons" element={<AdminCoupons />} />
        <Route path="reviews" element={<AdminReviews />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes