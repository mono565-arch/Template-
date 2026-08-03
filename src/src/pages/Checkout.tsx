import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowLeft, FiCheckCircle, FiTag, FiX, FiTruck, FiMapPin, FiPhone, FiUser, FiFileText } from 'react-icons/fi'
import { routes } from '../constants/routes'
import { useCartContext } from '../context/CartContext'
import { formatCurrency } from '../utils/formatters'

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

interface PlacedOrder {
  id: string
  customer: string
  phone: string
  address: string
  notes: string
  items: OrderItem[]
  total: number
  status: 'Pending' | 'Preparing' | 'Out for Delivery' | 'Delivered'
  date: string
  read: boolean
}

const coupons = [
  { code: 'SAVE10', discount: 0.10, type: 'percentage' as const },
  { code: 'WELCOME5', discount: 5, type: 'fixed' as const },
]

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCartContext()
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    notes: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<typeof coupons[0] | null>(null)
  const [couponError, setCouponError] = useState('')
  const [orderPlaced, setOrderPlaced] = useState(false)

  const deliveryFee = totalPrice >= 25 ? 0 : 3.99

  const discountAmount = appliedCoupon
    ? appliedCoupon.type === 'percentage'
      ? totalPrice * appliedCoupon.discount
      : Math.min(appliedCoupon.discount, totalPrice)
    : 0

  const finalTotal = totalPrice + deliveryFee - discountAmount

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required'
    else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone.trim())) newErrors.phone = 'Enter a valid phone number'
    if (!formData.address.trim()) newErrors.address = 'Address is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleApplyCoupon = () => {
    setCouponError('')
    const coupon = coupons.find((c) => c.code.toLowerCase() === couponCode.trim().toLowerCase())
    if (coupon) {
      setAppliedCoupon(coupon)
      setCouponCode('')
    } else {
      setCouponError('Invalid coupon code')
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setCouponError('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      // Save order to localStorage
      const orderId = 'ORD-' + Date.now().toString(36).toUpperCase()
      const newOrder: PlacedOrder = {
        id: orderId,
        customer: formData.name,
        phone: formData.phone,
        address: formData.address,
        notes: formData.notes,
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        total: finalTotal,
        status: 'Pending',
        date: new Date().toISOString(),
        read: false,
      }

      const existingOrdersJson = localStorage.getItem('pizzaSaucyOrders')
      const existingOrders: PlacedOrder[] = existingOrdersJson ? JSON.parse(existingOrdersJson) : []
      existingOrders.unshift(newOrder)
      localStorage.setItem('pizzaSaucyOrders', JSON.stringify(existingOrders))

      setOrderPlaced(true)
      clearCart()
    }
  }

  if (orderPlaced) {
    return (
      <div className="flex flex-col items-center justify-center py-20 lg:py-32 space-y-6 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
          <FiCheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="font-heading font-bold text-2xl text-neutral-900">Order Placed Successfully!</h2>
        <p className="text-neutral-600 max-w-md">
          Thank you for your order. We will contact you shortly to confirm your delivery.
        </p>
        <Link to={routes.HOME} className="btn-primary">
          Back to Home
        </Link>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 lg:py-32 space-y-6 text-center">
        <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center">
          <FiTruck className="w-10 h-10 text-neutral-400" />
        </div>
        <h2 className="font-heading font-bold text-2xl text-neutral-900">Your cart is empty</h2>
        <p className="text-neutral-600 max-w-md">
          Add some items to your cart before checking out.
        </p>
        <Link to={routes.MENU} className="btn-primary">
          Browse Menu
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8 lg:space-y-12">
      <div className="flex items-center gap-4 pt-4">
        <Link to={routes.CART} className="p-2 rounded-lg hover:bg-neutral-100 transition-colors">
          <FiArrowLeft className="w-5 h-5 text-neutral-700" />
        </Link>
        <h1 className="section-title">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
        {/* Form */}
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit} className="card p-6 lg:p-8 space-y-6">
            <h2 className="font-heading font-semibold text-xl text-neutral-900">Delivery Information</h2>

            <div className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`input pl-10 ${errors.name ? 'border-red-400 focus:ring-red-400' : ''}`}
                    placeholder="John Doe"
                  />
                </div>
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`input pl-10 ${errors.phone ? 'border-red-400 focus:ring-red-400' : ''}`}
                    placeholder="+92 300 1234567"
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Delivery Address
                </label>
                <div className="relative">
                  <FiMapPin className="absolute left-3 top-3 w-5 h-5 text-neutral-400" />
                  <textarea
                    id="address"
                    rows={3}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className={`input pl-10 resize-none ${errors.address ? 'border-red-400 focus:ring-red-400' : ''}`}
                    placeholder="123 Pizza Lane, Gulberg III, Lahore"
                  />
                </div>
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Order Notes (Optional)
                </label>
                <div className="relative">
                  <FiFileText className="absolute left-3 top-3 w-5 h-5 text-neutral-400" />
                  <textarea
                    id="notes"
                    rows={2}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="input pl-10 resize-none"
                    placeholder="Any special instructions..."
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button type="submit" className="btn-primary w-full">
                <FiTruck className="w-4 h-4" />
                Place Order (Cash on Delivery)
              </button>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-2">
          <div className="card p-6 space-y-5 sticky top-24">
            <h2 className="font-heading font-semibold text-lg text-neutral-900">Order Summary</h2>

            {/* Items */}
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-900">{item.name}</span>
                    <span className="text-neutral-400">x{item.quantity}</span>
                  </div>
                  <span className="font-medium text-neutral-700">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-neutral-200 pt-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-600">Subtotal</span>
                <span className="font-medium text-neutral-900">{formatCurrency(totalPrice)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-600">Delivery Fee</span>
                <span className="font-medium text-neutral-900">
                  {deliveryFee === 0 ? 'Free' : formatCurrency(deliveryFee)}
                </span>
              </div>
              {appliedCoupon && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-green-600 flex items-center gap-1">
                    <FiTag className="w-3.5 h-3.5" />
                    Coupon ({appliedCoupon.code})
                  </span>
                  <span className="font-medium text-green-600">-{formatCurrency(discountAmount)}</span>
                </div>
              )}
              <div className="border-t border-neutral-200 pt-3 flex items-center justify-between">
                <span className="font-semibold text-neutral-900">Total</span>
                <span className="font-bold text-lg text-primary-700">{formatCurrency(finalTotal)}</span>
              </div>
            </div>

            {/* Coupon */}
            <div className="pt-2">
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                  <span className="text-sm text-green-700 font-medium">{appliedCoupon.code} applied</span>
                  <button onClick={handleRemoveCoupon} className="text-green-700 hover:text-green-800">
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Coupon code"
                    className="input flex-1 text-sm"
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleApplyCoupon())}
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 bg-neutral-100 text-neutral-700 text-sm font-medium rounded-lg hover:bg-neutral-200 transition-colors"
                  >
                    Apply
                  </button>
                </div>
              )}
              {couponError && <p className="text-red-500 text-xs mt-1.5">{couponError}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
