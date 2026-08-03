import { Link } from 'react-router-dom'
import { FiFacebook, FiInstagram, FiPhone, FiMail, FiMapPin, FiShield } from 'react-icons/fi'
import { routes } from '../constants/routes'

// Social URLs - can be changed in admin settings later
const socialUrls = {
  facebook: 'https://facebook.com/pizzasaucy',
  instagram: 'https://instagram.com/pizzasaucy',
  whatsapp: 'https://wa.me/923001234567',
}

const Footer = () => {
  const quickLinks = [
    { to: routes.HOME, label: 'Home' },
    { to: routes.ABOUT, label: 'About Us' },
    { to: routes.MENU, label: 'Menu' },
    { to: routes.CONTACT, label: 'Contact' },
  ]

  const supportLinks = [
    { to: routes.CART, label: 'Cart' },
    { to: routes.CHECKOUT, label: 'Checkout' },
    { to: routes.LOGIN, label: 'Login' },
    { to: routes.REGISTER, label: 'Register' },
  ]

  return (
    <footer className="bg-neutral-900 text-neutral-300 relative">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to={routes.HOME} className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <span className="text-neutral-900 font-bold text-lg">🍕</span>
              </div>
              <span className="font-heading font-bold text-xl text-white">
                Pizza<span className="text-primary">Saucy</span>
              </span>
            </Link>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Serving the most delicious pizzas in town since 2010. Fresh ingredients, authentic recipes, and a passion for great food.
            </p>
            <div className="flex items-center gap-3">
              <a
                href={socialUrls.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-neutral-800 flex items-center justify-center hover:bg-primary hover:text-neutral-900 transition-colors"
                aria-label="Facebook"
              >
                <FiFacebook className="w-4 h-4" />
              </a>
              <a
                href={socialUrls.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-neutral-800 flex items-center justify-center hover:bg-primary hover:text-neutral-900 transition-colors"
                aria-label="Instagram"
              >
                <FiInstagram className="w-4 h-4" />
              </a>
              <a
                href={socialUrls.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-neutral-800 flex items-center justify-center hover:bg-primary hover:text-neutral-900 transition-colors"
                aria-label="WhatsApp"
              >
                <span className="text-sm font-bold">W</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-heading font-semibold text-white text-lg">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-neutral-400 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-heading font-semibold text-white text-lg">Support</h3>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-neutral-400 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-heading font-semibold text-white text-lg">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <FiMapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <span className="text-sm text-neutral-400">
                  123 Pizza Lane, Gulberg III, Lahore, Pakistan
                </span>
              </li>
              <li className="flex items-center gap-3">
                <FiPhone className="w-5 h-5 text-primary shrink-0" />
                <span className="text-sm text-neutral-400">+92 (42) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <FiMail className="w-5 h-5 text-primary shrink-0" />
                <span className="text-sm text-neutral-400">hello@pizzasaucy.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-neutral-800 text-center">
          <p className="text-sm text-neutral-500">
            &copy; {new Date().getFullYear()} Pizza Saucy. All rights reserved.
          </p>
        </div>
      </div>

      {/* Admin Panel Link - Bottom Right */}
      <Link
        to="/admin-login"
        className="fixed bottom-4 right-4 z-40 flex items-center gap-2 px-4 py-2.5 bg-neutral-800/90 backdrop-blur-sm text-neutral-300 text-xs font-medium rounded-full border border-neutral-700 hover:bg-primary hover:text-neutral-900 hover:border-primary transition-all shadow-lg"
      >
        <FiShield className="w-3.5 h-3.5" />
        Admin Panel
      </Link>
    </footer>
  )
}

export default Footer
