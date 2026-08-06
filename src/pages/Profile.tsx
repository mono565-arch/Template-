import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiShoppingBag, FiClock, FiCheckCircle, FiMapPin, FiUser, FiPackage, FiCamera, FiEdit2, FiCheck, FiX } from 'react-icons/fi'
import { routes } from '../constants/routes'
import { formatCurrency, formatDateTime } from '../utils/formatters'
import { LS_KEYS, getItem } from '../utils/localStorage'
import { authService, userService } from '../services/api'
import type { Order, User } from '../types'

const Profile = () => {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [user, setUser] = useState<{ name: string; email: string; phone?: string; photo?: string } | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({ name: '', email: '', phone: '' })

  useEffect(() => {
    // Load user from Firebase Auth + Firestore
    const unsubscribe = authService.onAuthChange((firebaseUser) => {
      if (firebaseUser) {
        setUser({
          name: firebaseUser.name,
          email: firebaseUser.email,
          phone: firebaseUser.phone,
          photo: firebaseUser.avatar,
        })
      } else {
        setUser(null)
      }
    })
    const storedOrders = getItem<Order[]>(LS_KEYS.ORDERS, [])
    setOrders(storedOrders)
    return () => unsubscribe()
  }, [])

  const updateAuthStorage = async (updatedUser: Partial<User>) => {
    const currentUser = await authService.getCurrentUser()
    if (currentUser) {
      await userService.update(currentUser.id, updatedUser)
      setUser(prev => prev ? { ...prev, ...updatedUser } : null)
    }
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = reader.result as string
      updateAuthStorage({ avatar: base64 })
    }
    reader.readAsDataURL(file)
  }

  const handleEditStart = () => {
    if (user) {
      setEditForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      })
    }
    setIsEditing(true)
  }

  const handleEditSave = () => {
    updateAuthStorage({
      name: editForm.name,
      email: editForm.email,
      phone: editForm.phone
    })
    setIsEditing(false)
  }

  const handleEditCancel = () => {
    setIsEditing(false)
  }

  const handleLogout = async () => {
    await authService.logout()
    navigate(routes.LOGIN)
  }

  return (
    <div className='space-y-8 lg:space-y-12'>
      <section className='text-center space-y-4 pt-4'>
        <h1 className='section-title'>My Profile</h1>
        <p className='section-subtitle max-w-2xl mx-auto'>
          View your order history and account details.
        </p>
      </section>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12'>
        <div className='lg:col-span-1'>
          <div className='card p-6 lg:p-8 space-y-6 sticky top-24'>
            <div className='text-center'>
              {/* Profile Photo */}
              <div className='relative w-24 h-24 mx-auto mb-4'>
                <div className='w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center overflow-hidden'>
                  {user?.photo ? (
                    <img src={user.photo} alt="Profile" className='w-full h-full object-cover' />
                  ) : (
                    <FiUser className='w-12 h-12 text-primary-600' />
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className='absolute bottom-0 right-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center hover:bg-primary-700 transition-colors shadow-md'
                  title="Change photo"
                >
                  <FiCamera className='w-4 h-4' />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className='hidden'
                />
              </div>

              {/* Name / Email */}
              {isEditing ? (
                <div className='space-y-3'>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Name"
                    className='w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500'
                  />
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="Email"
                    className='w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500'
                  />
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="Phone"
                    className='w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500'
                  />
                  <div className='flex gap-2 justify-center'>
                    <button onClick={handleEditSave} className='btn-primary text-xs px-4 py-2 flex items-center gap-1'>
                      <FiCheck className='w-3 h-3' /> Save
                    </button>
                    <button onClick={handleEditCancel} className='btn-outline text-xs px-4 py-2 flex items-center gap-1'>
                      <FiX className='w-3 h-3' /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className='font-heading font-semibold text-xl text-neutral-900'>{user?.name || 'Guest'}</h2>
                  <p className='text-neutral-500 text-sm mt-1'>{user?.email || 'No email'}</p>
                  {user?.phone && <p className='text-neutral-500 text-sm'>{user.phone}</p>}
                  <button
                    onClick={handleEditStart}
                    className='mt-3 text-primary-600 text-xs flex items-center gap-1 mx-auto hover:underline'
                  >
                    <FiEdit2 className='w-3 h-3' /> Edit Profile
                  </button>
                </>
              )}
            </div>

            <div className='space-y-3 pt-4 border-t border-neutral-200'>
              <div className='flex items-center justify-between text-sm'>
                <span className='text-neutral-600'>Total Orders</span>
                <span className='font-semibold text-neutral-900'>{orders.length}</span>
              </div>
              <div className='flex items-center justify-between text-sm'>
                <span className='text-neutral-600'>Pending</span>
                <span className='font-semibold text-yellow-600'>{orders.filter(o => o.status === 'pending').length}</span>
              </div>
              <div className='flex items-center justify-between text-sm'>
                <span className='text-neutral-600'>Completed</span>
                <span className='font-semibold text-green-600'>{orders.filter(o => o.status === 'completed').length}</span>
              </div>
            </div>
            <button onClick={handleLogout} className='btn-outline w-full text-sm'>
              Logout
            </button>
          </div>
        </div>
        <div className='lg:col-span-2 space-y-6'>
          <h2 className='font-heading font-semibold text-xl text-neutral-900'>Order History</h2>
          {orders.length === 0 ? (
            <div className='card p-12 text-center space-y-4'>
              <div className='w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto'>
                <FiShoppingBag className='w-8 h-8 text-neutral-400' />
              </div>
              <h3 className='font-heading font-semibold text-lg text-neutral-900'>No orders yet</h3>
              <p className='text-neutral-600 text-sm'>You have not placed any orders yet.</p>
              <button onClick={() => navigate(routes.MENU)} className='btn-primary'>
                Browse Menu
              </button>
            </div>
          ) : (
            <div className='space-y-4'>
              {orders.map((order) => (
                <div key={order.id} className='card p-6 space-y-4'>
                  <div className='flex items-start justify-between flex-wrap gap-2'>
                    <div>
                      <p className='text-sm font-bold text-primary-700'>{order.id}</p>
                      <p className='text-xs text-neutral-500 mt-0.5'>{order.createdAt ? formatDateTime(order.createdAt) : 'N/A'}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full ${
                        order.status === 'completed' ? 'bg-green-100 text-green-700' :
                        order.status === 'preparing' ? 'bg-primary-100 text-primary-700' :
                        order.status === 'ready' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                      {order.status === 'completed' ? <FiCheckCircle className='w-3 h-3' /> : 
                       order.status === 'preparing' ? <FiClock className='w-3 h-3' /> : 
                       order.status === 'ready' ? <FiPackage className='w-3 h-3' /> : 
                       <FiClock className='w-3 h-3' />}
                      {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Pending'}
                    </span>
                  </div>
                  <div className='space-y-2'>
                    {Array.isArray(order.items) && order.items.map((item, idx) => (
                      <div key={idx} className='flex items-center justify-between text-sm'>
                        <div className='flex items-center gap-2'>
                          <FiPackage className='w-4 h-4 text-neutral-400' />
                          <span className='text-neutral-700'>{item.name} x{item.quantity}</span>
                          {item.size && <span className='text-xs text-neutral-400'>({item.size})</span>}
                        </div>
                        <span className='text-neutral-600'>{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  <div className='border-t border-neutral-200 pt-3 flex items-center justify-between'>
                    <span className='text-sm text-neutral-600'>Total</span>
                    <span className='font-bold text-lg text-primary-700'>{formatCurrency(typeof order.total === 'number' ? order.total : 0)}</span>
                  </div>
                  {order.deliveryAddress && (
                    <div className='flex items-start gap-2 text-xs text-neutral-500'>
                      <FiMapPin className='w-3.5 h-3.5 mt-0.5 shrink-0' />
                      <span>{order.deliveryAddress}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile