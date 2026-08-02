import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
  FiHome,
  FiPackage,
  FiGrid,
  FiShoppingBag,
  FiTag,
  FiStar,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
  FiBell,
} from 'react-icons/fi'

interface PlacedOrder {
  id: string
  read: boolean
}

interface NavItem {
  to: string
  label: string
  icon: React.ElementType
  badge?: number
}

const AdminLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (!localStorage.getItem('adminAuth')) {
      navigate('/admin-login')
    }
  }, [navigate])

  // Poll for unread orders
  useEffect(() => {
    const checkUnread = () => {
      const stored = localStorage.getItem('pizzaSaucyOrders')
      const orders: PlacedOrder[] = stored ? JSON.parse(stored) : []
      setUnreadCount(orders.filter((o) => !o.read).length)
    }

    checkUnread()
    const interval = setInterval(checkUnread, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('adminAuth')
    navigate('/admin-login')
  }

  const navItems: NavItem[] = [
    { to: '/admin', label: 'Dashboard', icon: FiHome },
    { to: '/admin/products', label: 'Products', icon: FiPackage },
    { to: '/admin/categories', label: 'Categories', icon: FiGrid },
    { to: '/admin/orders', label: 'Orders', icon: FiShoppingBag, badge: unreadCount },
    { to: '/admin/coupons', label: 'Coupons', icon: FiTag },
    { to: '/admin/reviews', label: 'Reviews', icon: FiStar },
    { to: '/admin/settings', label: 'Settings', icon: FiSettings },
  ]

  const currentLabel =
    navItems.find((n) => n.to === location.pathname)?.label || 'Dashboard'

  return (
    <div className="min-h-screen bg-neutral-100 flex">
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? (
          <FiX className="w-5 h-5" />
        ) : (
          <FiMenu className="w-5 h-5" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-neutral-900 text-white transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-200`}
      >
        <div className="p-6 flex items-center gap-3">
  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
    <span className="text-neutral-900 font-bold text-lg">🍕</span>
  </div>
  <div>
    <h1 className="font-heading font-bold text-xl">
      Pizza<span className="text-primary">Saucy</span>
    </h1>
    <p className="text-neutral-400 text-xs mt-0.5">Admin Panel</p>
  </div>
</div>
        <nav className="px-4 pb-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.to
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-primary text-neutral-900'
                    : 'text-neutral-300 hover:bg-neutral-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="flex-1">{item.label}</span>
                {item.badge ? (
                  <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                ) : null}
              </Link>
            )
          })}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-red-400 hover:bg-neutral-800 transition-colors mt-4"
          >
            <FiLogOut className="w-5 h-5" />
            Logout
          </button>
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="flex-1 overflow-auto min-w-0">
        <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between lg:justify-end">
          <h2 className="font-heading font-semibold text-lg text-neutral-900 lg:hidden ml-12">
            {currentLabel}
          </h2>
          <div className="hidden lg:flex items-center gap-4">
            {unreadCount > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium">
                <FiBell className="w-4 h-4" />
                {unreadCount} new
              </div>
            )}
            <h2 className="font-heading font-semibold text-lg text-neutral-900">
              {currentLabel}
            </h2>
          </div>
        </header>
        <div className="p-4 sm:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AdminLayout
