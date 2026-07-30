import { Link } from 'react-router-dom'
import { FiArrowLeft, FiCreditCard, FiTruck } from 'react-icons/fi'
import { routes } from '../constants/routes'

const Checkout = () => {
  return (
    <div className="space-y-8 lg:space-y-12">
      <div className="flex items-center gap-4">
        <Link to={routes.CART} className="p-2 rounded-lg hover:bg-neutral-100 transition-colors">
          <FiArrowLeft className="w-5 h-5 text-neutral-700" />
        </Link>
        <h1 className="section-title">Checkout</h1>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="card p-8 text-center space-y-6">
          <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto">
            <FiCreditCard className="w-10 h-10 text-primary-600" />
          </div>
          <div className="space-y-2">
            <h2 className="font-heading font-semibold text-xl">Checkout Coming Soon</h2>
            <p className="text-neutral-600 text-sm">
              The checkout feature is under development. Stay tuned for updates!
            </p>
          </div>
          <Link to={routes.MENU} className="btn-primary inline-flex">
            Continue Shopping
            <FiTruck className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Checkout
