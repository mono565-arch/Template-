import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom'
import {
  FiHome, FiShoppingBag, FiTag, FiUsers, FiStar,
  FiSettings, FiLogOut, FiMenu, FiX, FiMessageSquare
} from 'react-icons/fi'
import { routes } from '../constants/routes'

const AdminLayout = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const checkAuth = () => {
      const adminAuth = localStorage.getItem('pizza_saucy_admin_auth')
      if (!adminAuth) {
        navigate('/admin-login')
      }
    }
    checkAuth()
  }, [navigate])

  useEffect(() => {
    const loadUnread = () => {
      const messages = JSON.parse(localStorage.getItem('pizza_saucy_messages') || '[]')
      setUnreadCount(messages.filter((m: { read: boolean }) => !m.read).length)
    }
    loadUnread()
    const interval = setInterval(loadUnread, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('pizza_saucy_admin_auth')
    navigate('/admin-login')
  }

  const navItems = [
    { to: '/admin', icon: FiHome, label: 'Dashboard' },
    { to: '/admin/orders', icon: FiShoppingBag, label: 'Orders' },
    { to: '/admin/messages', icon: FiMessageSquare, label: 'Messages', badge: unreadCount },
    { to: '/admin/reviews', icon: FiStar, label: 'Reviews' },
    { to: '/admin/products', icon: FiTag, label: 'Products' },
    { to: '/admin/categories', icon: FiUsers, label: 'Categories' },
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
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-neutral-900 font-bold text-lg">🍕</span>
            </div>
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
                <span className="w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {item.badge}
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
