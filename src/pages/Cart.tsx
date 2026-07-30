import { Link } from 'react-router-dom'
import { FiShoppingBag, FiArrowRight, FiTrash2, FiMinus, FiPlus } from 'react-icons/fi'
import { routes } from '../constants/routes'

const Cart = () => {
  return (
    <div className="space-y-8 lg:space-y-12">
      <div className="text-center space-y-4">
        <h1 className="section-title">Your Cart</h1>
        <p className="section-subtitle max-w-2xl mx-auto">
          Review your items and proceed to checkout.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="card p-8 text-center space-y-6">
          <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto">
            <FiShoppingBag className="w-10 h-10 text-neutral-400" />
          </div>
          <div className="space-y-2">
            <h2 className="font-heading font-semibold text-xl">Your cart is empty</h2>
            <p className="text-neutral-600 text-sm">
              Looks like you have not added any items yet. Browse our menu and add some delicious pizza!
            </p>
          </div>
          <Link to={routes.MENU} className="btn-primary inline-flex">
            Browse Menu
            <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Cart
