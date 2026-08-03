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
} from 'react-icons/fi'

const AdminLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('adminAuth')) {
      navigate('/admin-login')
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('adminAuth')
    navigate('/admin-login')
  }

  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: FiHome },
    { to: '/admin/products', label: 'Products', icon: FiPackage },
    { to: '/admin/categories', label: 'Categories', icon: FiGrid },
    { to: '/admin/orders', label: 'Orders', icon: FiShoppingBag },
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
        <div className="p-6">
          <h1 className="font-heading font-bold text-xl">
            Pizza<span className="text-primary">Saucy</span>
          </h1>
          <p className="text-neutral-400 text-xs mt-1">Admin Panel</p>
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
                {item.label}
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
          <h2 className="font-heading font-semibold text-lg text-neutral-900 hidden lg:block">
            {currentLabel}
          </h2>
        </header>
        <div className="p-4 sm:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AdminLayout
