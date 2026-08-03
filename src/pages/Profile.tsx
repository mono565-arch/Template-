import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FiUser, FiMail, FiPhone, FiMapPin, FiEdit3, FiPackage, FiClock,
  FiCheckCircle, FiTruck, FiXCircle, FiCamera, FiSave, FiLogOut
} from 'react-icons/fi'
import { routes } from '../constants/routes'
import { formatCurrency, formatDate } from '../utils/formatters'
import type { Order, OrderStatus } from '../types'

interface UserData {
  id: string
  name: string
  email: string
  avatar?: string
  phone?: string
  address?: string
}

const Profile = () => {
  const navigate = useNavigate()
  const [auth, setAuth] = useState<UserData | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '' })
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    const storedAuth = localStorage.getItem('pizza_saucy_auth')
    if (!storedAuth) {
      navigate(routes.LOGIN)
      return
    }
    const parsed = JSON.parse(storedAuth)
    setAuth(parsed)
    setFormData({
      name: parsed.name || '',
      email: parsed.email || '',
      phone: parsed.phone || '',
      address: parsed.address || '',
    })

    // Load orders
    const storedOrders = JSON.parse(localStorage.getItem('pizza_saucy_orders') || '[]')
    const userOrders = storedOrders.filter((o: Order) => o.customerName === parsed.name || o.customerPhone === parsed.phone)
    setOrders(userOrders)
  }, [navigate])

  const handleSave = () => {
    if (!auth) return
    const updated = { ...auth, ...formData }
    setAuth(updated)
    localStorage.setItem('pizza_saucy_auth', JSON.stringify(updated))

    // Update users list
    const users = JSON.parse(localStorage.getItem('pizza_saucy_users') || '[]')
    const idx = users.findIndex((u: UserData) => u.id === auth.id)
    if (idx >= 0) {
      users[idx] = { ...users[idx], ...formData }
      localStorage.setItem('pizza_saucy_users', JSON.stringify(users))
    }

    setSaveSuccess(true)
    setIsEditing(false)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && auth) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const updated = { ...auth, avatar: reader.result as string }
        setAuth(updated)
        localStorage.setItem('pizza_saucy_auth', JSON.stringify(updated))
        const users = JSON.parse(localStorage.getItem('pizza_saucy_users') || '[]')
        const idx = users.findIndex((u: UserData) => u.id === auth.id)
        if (idx >= 0) {
          users[idx].avatar = reader.result as string
          localStorage.setItem('pizza_saucy_users', JSON.stringify(users))
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('pizza_saucy_auth')
    navigate(routes.HOME)
  }

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'completed': return <FiCheckCircle className="w-4 h-4 text-green-500" />
      case 'preparing': return <FiClock className="w-4 h-4 text-primary" />
      case 'ready': return <FiTruck className="w-4 h-4 text-blue-500" />
      case 'pending': return <FiPackage className="w-4 h-4 text-neutral-400" />
      case 'cancelled': return <FiXCircle className="w-4 h-4 text-red-500" />
      default: return <FiPackage className="w-4 h-4 text-neutral-400" />
    }
  }

  const getStatusStyle = (status: OrderStatus) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700'
      case 'preparing': return 'bg-primary-100 text-primary-700'
      case 'ready': return 'bg-blue-100 text-blue-700'
      case 'pending': return 'bg-yellow-100 text-yellow-700'
      case 'cancelled': return 'bg-red-100 text-red-700'
      default: return 'bg-neutral-100 text-neutral-600'
    }
  }

  if (!auth) return null

  return (
    <div className="space-y-8 lg:space-y-12">
      {/* Header */}
      <section className="text-center space-y-4 pt-4">
        <h1 className="section-title">My Profile</h1>
        <p className="section-subtitle max-w-2xl mx-auto">
          Manage your account information and view your order history.
        </p>
      </section>

      {saveSuccess && (
        <div className="max-w-2xl mx-auto bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm text-center">
          Profile updated successfully!
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="lg:col-span-1">
          <div className="card p-6 space-y-6">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                {auth.avatar ? (
                  <img src={auth.avatar} alt={auth.name} className="w-20 h-20 rounded-full object-cover border-4 border-primary-200" />
                ) : (
                  <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
                    <FiUser className="w-10 h-10 text-primary-600" />
                  </div>
                )}
                <label className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary rounded-full flex items-center justify-center cursor-pointer shadow-md hover:bg-primary-600 transition-colors">
                  <FiCamera className="w-4 h-4 text-neutral-900" />
                  <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                </label>
              </div>
              <div className="text-center">
                <h2 className="font-heading font-semibold text-lg text-neutral-900">{auth.name}</h2>
                <p className="text-neutral-500 text-sm">Customer</p>
              </div>
            </div>

            {isEditing ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-600 mb-1">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input text-sm py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-600 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input text-sm py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-600 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="input text-sm py-2"
                    placeholder="+92 300 1234567"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-600 mb-1">Address</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="input text-sm py-2 resize-none"
                    rows={2}
                    placeholder="Your address"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button onClick={handleSave} className="btn-primary flex-1 text-sm py-2">
                    <FiSave className="w-4 h-4" /> Save
                  </button>
                  <button onClick={() => setIsEditing(false)} className="btn-outline flex-1 text-sm py-2">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="border-t border-neutral-200 pt-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <FiMail className="w-5 h-5 text-primary-600 shrink-0" />
                    <div>
                      <p className="text-xs text-neutral-500">Email</p>
                      <p className="font-medium text-sm text-neutral-900">{auth.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FiPhone className="w-5 h-5 text-primary-600 shrink-0" />
                    <div>
                      <p className="text-xs text-neutral-500">Phone</p>
                      <p className="font-medium text-sm text-neutral-900">{auth.phone || 'Not set'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FiMapPin className="w-5 h-5 text-primary-600 shrink-0" />
                    <div>
                      <p className="text-xs text-neutral-500">Address</p>
                      <p className="font-medium text-sm text-neutral-900">{auth.address || 'Not set'}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <button onClick={() => setIsEditing(true)} className="btn-outline w-full text-sm py-2">
                    <FiEdit3 className="w-4 h-4" />
                    Edit Profile
                  </button>
                  <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition-colors">
                    <FiLogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Order History */}
        <div className="lg:col-span-2">
          <div className="card p-6 space-y-5">
            <h2 className="font-heading font-semibold text-xl text-neutral-900">Order History</h2>
            {orders.length > 0 ? (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(order.status)}
                      <div>
                        <p className="font-semibold text-sm text-neutral-900">{order.id}</p>
                        <p className="text-xs text-neutral-500">
                          {formatDate(order.createdAt)} · {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm text-neutral-900">
                        {formatCurrency(order.total)}
                      </p>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusStyle(order.status)}`}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-neutral-500 text-sm text-center py-8">No orders yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
