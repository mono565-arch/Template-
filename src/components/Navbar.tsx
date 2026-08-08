import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { FiShoppingCart, FiMenu, FiX, FiUser, FiLogOut } from 'react-icons/fi'
import { routes } from '../constants/routes'
import { useCartContext } from '../context/CartContext'
import { authService } from '../services/api'

interface AuthUser {
  id: string
  name: string
  email: string
  avatar?: string
  role: string
}

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [authUser, setAuthUser] = useState<AuthUser | null>(null)
  const { totalItems } = useCartContext()
  const navigate = useNavigate()

  // 🔥 FIX: Check Firebase Auth + localStorage fallback
  useEffect(() => {
    const checkAuth = () => {
      // First try Firebase Auth
      const unsubscribe = authService.onAuthChange((user) => {
        if (user) {
          setAuthUser({
            id: user.id,
            name: user.name || user.email?.split('@')[0] || 'User',
            email: user.email,
            avatar: user.avatar,
            role: user.role,
          })
        } else {
          // Fallback: localStorage (jab tak Firebase sync na ho)
          const stored = localStorage.getItem('pizza_saucy_user')
          if (stored) {
            try {
              const parsed = JSON.parse(stored)
              if (parsed.id || parsed.email) {
                setAuthUser({
                  id: parsed.id || '',
                  name: parsed.name || parsed.email?.split('@')[0] || 'User',
                  email: parsed.email || '',
                  role: parsed.role || 'customer',
                })
                return
              }
            } catch {
              // ignore
            }
          }
          setAuthUser(null)
        }
      })
      return unsubscribe
    }

    const unsubscribe = checkAuth()
    
    // Also listen for storage changes (login/logout from other tabs)
    const handleStorage = () => {
      const stored = localStorage.getItem('pizza_saucy_user')
      if (!stored) setAuthUser(null)
    }
    window.addEventListener('storage', handleStorage)
    
    return () => {
      unsubscribe()
      window.removeEventListener('storage', handleStorage)
    }
  }, [])

  const navLinks = [
    { to: routes.HOME, label: 'Home' },
    { to: routes.ABOUT, label: 'About' },
    { to: routes.MENU, label: 'Menu' },
    { to: routes.CONTACT, label: 'Contact' },
  ]

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev)
  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  const handleLogout = async () => {
    try {
      await authService.logout()
    } catch (err) {
      console.error(err)
    }
    localStorage.removeItem('pizza_saucy_user')
    setAuthUser(null)
    navigate(routes.HOME)
    closeMobileMenu()
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to={routes.HOME} className="flex items-center gap-2" onClick={closeMobileMenu}>
            <img src="/logo.png" alt="Pizza Saucy" className="w-10 h-10 object-contain" />
            <span className="font-heading font-bold text-xl text-neutral-900">
              Pizza<span className="text-primary-600">Saucy</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === routes.HOME}
                className={({ isActive }) =>
                  `font-medium text-sm transition-colors duration-200 ${
                    isActive ? 'text-primary-600' : 'text-neutral-700 hover:text-primary-600'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to={routes.CART}
              className="relative p-2 text-neutral-700 hover:text-primary-600 transition-colors"
              aria-label="Cart"
            >
              <FiShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-neutral-900 text-xs font-bold rounded-full flex items-center justify-center">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>
            {authUser ? (
              <div className="flex items-center gap-3">
                <Link
                  to={routes.PROFILE}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-neutral-100 transition-colors"
                >
                  {authUser.avatar ? (
                    <img src={authUser.avatar} alt={authUser.name} className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <FiUser className="w-4 h-4 text-primary-600" />
                    </div>
                  )}
                  <span className="text-sm font-medium text-neutral-700">{authUser.name.split(' ')[0]}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-neutral-400 hover:text-red-500 transition-colors"
                  aria-label="Logout"
                >
                  <FiLogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link
                to={routes.LOGIN}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-neutral-900 font-semibold text-sm rounded-lg hover:bg-primary-600 transition-colors"
              >
                <FiUser className="w-4 h-4" />
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-neutral-700 hover:text-primary-600 transition-colors"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-neutral-200">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === routes.HOME}
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `block py-2 px-3 rounded-lg font-medium text-sm transition-colors ${
                    isActive ? 'bg-primary-50 text-primary-600' : 'text-neutral-700 hover:bg-neutral-100'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <div className="pt-3 border-t border-neutral-200 space-y-3">
              <Link
                to={routes.CART}
                onClick={closeMobileMenu}
                className="flex items-center gap-3 py-2 px-3 rounded-lg text-neutral-700 hover:bg-neutral-100"
              >
                <FiShoppingCart className="w-5 h-5" />
                <span className="font-medium text-sm">Cart ({totalItems})</span>
              </Link>
              {authUser ? (
                <>
                  <Link
                    to={routes.PROFILE}
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 py-2 px-3 rounded-lg text-neutral-700 hover:bg-neutral-100"
                  >
                    <FiUser className="w-5 h-5" />
                    <span className="font-medium text-sm">{authUser.name}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 py-2 px-3 rounded-lg text-red-600 hover:bg-red-50"
                  >
                    <FiLogOut className="w-5 h-5" />
                    <span className="font-medium text-sm">Logout</span>
                  </button>
                </>
              ) : (
                <Link
                  to={routes.LOGIN}
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 py-2 px-3 rounded-lg bg-primary text-neutral-900 font-semibold text-sm"
                >
                  <FiUser className="w-5 h-5" />
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar