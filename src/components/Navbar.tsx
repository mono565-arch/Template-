import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { FiShoppingCart, FiMenu, FiX, FiUser } from 'react-icons/fi'
import { routes } from '../constants/routes'
import { useCartContext } from '../context/CartContext'

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { totalItems } = useCartContext()

  const navLinks = [
    { to: routes.HOME, label: 'Home' },
    { to: routes.ABOUT, label: 'About' },
    { to: routes.MENU, label: 'Menu' },
    { to: routes.CONTACT, label: 'Contact' },
  ]

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to={routes.HOME} className="flex items-center gap-2" onClick={closeMobileMenu}>
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-neutral-900 font-bold text-lg">🍕</span>
            </div>
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
                    isActive
                      ? 'text-primary-600'
                      : 'text-neutral-700 hover:text-primary-600'
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
            <Link
              to={routes.LOGIN}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-neutral-900 font-semibold text-sm rounded-lg hover:bg-primary-600 transition-colors"
            >
              <FiUser className="w-4 h-4" />
              Login
            </Link>
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
                    isActive
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-neutral-700 hover:bg-neutral-100'
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
              <Link
                to={routes.LOGIN}
                onClick={closeMobileMenu}
                className="flex items-center gap-3 py-2 px-3 rounded-lg bg-primary text-neutral-900 font-semibold text-sm"
              >
                <FiUser className="w-5 h-5" />
                Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
