import { Link } from 'react-router-dom'
import { FiShoppingBag, FiArrowRight, FiTrash2, FiMinus, FiPlus, FiX } from 'react-icons/fi'
import { routes } from '../constants/routes'
import { useCartContext } from '../context/CartContext'
import { formatCurrency } from '../utils/formatters'

const Cart = () => {
  const { items, removeItem, updateQuantity, totalItems, totalPrice, clearCart } = useCartContext()

  return (
    <div className="space-y-8 lg:space-y-12">
      {/* Header */}
      <section className="text-center space-y-4 pt-4">
        <h1 className="section-title">Your Cart</h1>
        <p className="section-subtitle max-w-2xl mx-auto">
          Review your items and proceed to checkout.
        </p>
      </section>

      {items.length === 0 ? (
        /* Empty Cart */
        <div className="max-w-md mx-auto">
          <div className="card p-10 text-center space-y-6">
            <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto">
              <FiShoppingBag className="w-10 h-10 text-neutral-400" />
            </div>
            <div className="space-y-2">
              <h2 className="font-heading font-semibold text-xl">Your cart is empty</h2>
              <p className="text-neutral-600 text-sm">
                Looks like you have not added any items yet. Browse our menu and add some delicious food!
              </p>
            </div>
            <Link to={routes.MENU} className="btn-primary inline-flex">
              Browse Menu
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        /* Cart with Items */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-neutral-500">
                {totalItems} item{totalItems !== 1 ? 's' : ''} in cart
              </p>
              <button
                onClick={clearCart}
                className="text-sm text-red-500 hover:text-red-700 font-medium flex items-center gap-1 transition-colors"
              >
                <FiTrash2 className="w-3.5 h-3.5" />
                Clear All
              </button>
            </div>

            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="card p-4 sm:p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading font-semibold text-base text-neutral-900 truncate">
                      {item.name}
                    </h3>
                    <p className="text-primary-700 font-bold text-sm mt-0.5">
                      {formatCurrency(item.price)}
                    </p>
                    {item.size && <p className="text-xs text-neutral-500">{item.size}</p>}
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-9 h-9 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-600 hover:border-primary-400 hover:text-primary-700 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <FiMinus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-semibold text-neutral-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-9 h-9 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-600 hover:border-primary-400 hover:text-primary-700 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <FiPlus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Item Total */}
                  <div className="text-right min-w-[80px]">
                    <p className="font-bold text-neutral-900">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-neutral-400 hover:text-red-500 transition-colors"
                    aria-label="Remove item"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 space-y-5 sticky top-24">
              <h2 className="font-heading font-semibold text-lg text-neutral-900">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600">Subtotal</span>
                  <span className="font-medium text-neutral-900">{formatCurrency(totalPrice)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600">Delivery Fee</span>
                  <span className="font-medium text-neutral-900">{totalPrice >= 2500 ? 'Free' : `Rs 150.00`}</span>
                </div>
                <div className="border-t border-neutral-200 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-neutral-900">Total</span>
                    <span className="font-bold text-xl text-primary-700">
                      {formatCurrency(totalPrice >= 2500 ? totalPrice : totalPrice + 150)}
                    </span>
                  </div>
                </div>
              </div>
              <Link
                to={routes.CHECKOUT}
                className="btn-primary w-full"
              >
                Proceed to Checkout
                <FiArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to={routes.MENU}
                className="btn-outline w-full text-center"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart
