import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom'
import {
  FiHome, FiShoppingBag, FiTag, FiStar,
  FiSettings, FiLogOut, FiMenu, FiX, FiMessageSquare, FiGift
} from 'react-icons/fi'
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore'
import { db } from '../firebase/firebase'
import { routes } from '../constants/routes'

const AdminLayout = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // 🔥 Realtime badge counts from Firestore
  const [unreadMessages, setUnreadMessages] = useState(0)
  const [totalReviews, setTotalReviews] = useState(0)
  const [pendingOrders, setPendingOrders] = useState(0)

  useEffect(() => {
    // Messages unread count
    const unsubMessages = onSnapshot(
      query(collection(db, 'messages'), where('read', '==', false)),
      (snapshot) => setUnreadMessages(snapshot.size),
      (err) => console.error('Messages count error:', err)
    )

    // ✅ Reviews count — SAME query as AdminReviews.tsx (orderBy date)
    const unsubReviews = onSnapshot(
      query(collection(db, 'reviews'), orderBy('date', 'desc')),
      (snapshot) => setTotalReviews(snapshot.docs.length),
      (err) => console.error('Reviews count error:', err)
    )

    // Pending orders count
    const unsubOrders = onSnapshot(
      query(collection(db, 'orders'), where('status', '==', 'pending')),
      (snapshot) => setPendingOrders(snapshot.size),
      (err) => console.error('Orders count error:', err)
    )

    return () => {
      unsubMessages()
      unsubReviews()
      unsubOrders()
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('pizza_saucy_admin_auth')
    navigate('/admin-login')
  }

  const navItems = [
    { to: '/admin', icon: FiHome, label: 'Dashboard' },
    { to: '/admin/orders', icon: FiShoppingBag, label: 'Orders', badge: pendingOrders > 0 ? pendingOrders : undefined },
    { to: '/admin/messages', icon: FiMessageSquare, label: 'Messages', badge: unreadMessages > 0 ? unreadMessages : undefined },
    { to: '/admin/reviews', icon: FiStar, label: 'Reviews', badge: totalReviews > 0 ? totalReviews : undefined },
    { to: '/admin/products', icon: FiTag, label: 'Products' },
    { to: '/admin/deals', icon: FiGift, label: 'Deals' },
    { to: '/admin/coupons', icon: FiTag, label: 'Coupons' },
    { to: '/admin/settings', icon: FiSettings, label: 'Settings' },
  ]

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-neutral-900 text-white transform transition-transform duration-300 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6">
          <Link to={routes.HOME} className="flex items-center gap-2">
            <img src="/logo.png" alt="Pizza Saucy" className="w-10 h-10 object-contain rounded-full" />
            <span className="font-heading font-bold text-xl">
              Pizza<span className="text-primary">Saucy</span>
            </span>
          </Link>
          <p className="text-neutral-500 text-xs mt-1 ml-1">Admin Panel</p>
        </div>

        <nav className="px-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                location.pathname === item.to
                  ? 'bg-primary text-neutral-900'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="flex-1">{item.label}</span>
              {item.badge ? (
                <span className="min-w-[20px] h-5 px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              ) : null}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <FiLogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout