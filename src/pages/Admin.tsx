import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  FiUsers, FiShoppingBag, FiDollarSign, FiPieChart,
  FiBell, FiMessageSquare, FiStar, FiTrendingUp,
  FiPackage, FiClock, FiCheckCircle, FiXCircle,
  FiTag, FiGrid, FiTruck
} from 'react-icons/fi'
import { formatCurrency, formatDateTime } from '../utils/formatters'
import { getItem, LS_KEYS } from '../utils/localStorage'
import { getNotifications, markNotificationRead, markAllNotificationsRead, getUnreadCount, getLatestNotifications, getNotificationIcon, type Notification } from '../utils/notifications'
import type { Order, ContactMessage, Review } from '../types'

const Admin = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [productsCount, setProductsCount] = useState(0)
  const [categoriesCount, setCategoriesCount] = useState(0)
  const [couponsCount, setCouponsCount] = useState(0)
  const notificationRef = useRef<HTMLDivElement>(null)

  const loadData = useCallback(() => {
    const storedOrders = getItem<Order[]>(LS_KEYS.ORDERS, [])
    const storedMessages = getItem<ContactMessage[]>(LS_KEYS.MESSAGES, [])
    const storedReviews = getItem<Review[]>(LS_KEYS.REVIEWS, [])
    const storedProducts = getItem<{ id: string }[]>(LS_KEYS.PRODUCTS, [])
    const storedCategories = getItem<{ id: string }[]>(LS_KEYS.CATEGORIES, [])
    const storedCoupons = getItem<{ id: string }[]>(LS_KEYS.COUPONS, [])

    setOrders(storedOrders)
    setMessages(storedMessages)
    setReviews(storedReviews)
    setProductsCount(storedProducts.length)
    setCategoriesCount(storedCategories.length)
    setCouponsCount(storedCoupons.length)

    const notifs = getNotifications()
    setNotifications(notifs)
    setUnreadCount(getUnreadCount())
  }, [])

  useEffect(() => {
    loadData()
    const interval = setInterval(loadData, 3000)
    return () => clearInterval(interval)
  }, [loadData])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target as Node)) {
        setShowNotifications(false)
      }
    }
    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showNotifications])

  // Close dropdown on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowNotifications(false)
    }
    if (showNotifications) {
      document.addEventListener('keydown', handleEsc)
    }
    return () => document.removeEventListener('keydown', handleEsc)
  }, [showNotifications])

  const totalRevenue = orders.reduce((sum, o) => sum + (typeof o.total === 'number' ? o.total : 0), 0)
  const pendingOrders = orders.filter((o) => o.status === 'pending').length
  const completedOrders = orders.filter((o) => o.status === 'completed').length
  const unreadMessages = messages.filter((m) => !m.read).length

  const markAllRead = () => {
    markAllNotificationsRead()
    setNotifications(getNotifications())
    setUnreadCount(0)
  }

  const handleNotificationClick = (notif: Notification) => {
    markNotificationRead(notif.id)
    setNotifications(getNotifications())
    setUnreadCount(getUnreadCount())
    if (notif.link) {
      window.location.href = notif.link
    }
  }

  const latestNotifications = getLatestNotifications(5)

  const getNotificationLink = (type: Notification['type']) => {
    switch (type) {
      case 'order':
      case 'order_cancelled':
        return '/admin/orders'
      case 'review':
        return '/admin/reviews'
      case 'message':
        return '/admin/messages'
      case 'coupon':
        return '/admin/coupons'
      case 'product_added':
      case 'product_updated':
      case 'product_deleted':
        return '/admin/products'
      case 'category_added':
      case 'category_deleted':
        return '/admin/categories'
      default:
        return '/admin'
    }
  }

  return (
    <div className="space-y-8 lg:space-y-12">
      {/* VIP Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 p-8 sm:p-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 text-primary rounded-full text-xs font-bold uppercase tracking-wider mb-3">
              <FiTrendingUp className="w-3 h-3" />
              VIP Dashboard
            </div>
            <h1 className="font-heading font-bold text-2xl sm:text-3xl text-white">
              Admin Control Center
            </h1>
            <p className="text-neutral-400 text-sm mt-1">
              Real-time overview of your restaurant performance.
            </p>
          </div>
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-3 bg-neutral-800 rounded-xl text-neutral-300 hover:text-primary hover:bg-neutral-700 transition-colors"
            >
              <FiBell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-neutral-200 z-50 overflow-hidden max-h-[70vh] flex flex-col">
                <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100 shrink-0">
                  <h3 className="font-semibold text-sm text-neutral-900">Notifications</h3>
                  <button onClick={markAllRead} className="text-xs text-primary-600 hover:underline">
                    Mark all read
                  </button>
                </div>
                <div className="overflow-y-auto flex-1">
                  {notifications.length === 0 ? (
                    <p className="text-sm text-neutral-500 text-center py-6">No notifications</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => handleNotificationClick(n)}
                        className={`flex items-start gap-3 px-4 py-3 border-b border-neutral-50 hover:bg-neutral-50 transition-colors cursor-pointer ${
                          !n.read ? 'bg-primary-50/30' : ''
                        }`}
                      >
                        <div className="shrink-0 text-lg">
                          {getNotificationIcon(n.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-neutral-900">{n.title}</p>
                          <p className="text-xs text-neutral-500 truncate">{n.message}</p>
                          <p className="text-[10px] text-neutral-400 mt-0.5">{formatDateTime(n.time)}</p>
                        </div>
                        {!n.read && <div className="w-2 h-2 bg-primary rounded-full shrink-0 mt-1" />}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6 space-y-3 border-l-4 border-l-primary">
          <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
            <FiShoppingBag className="w-6 h-6 text-primary-600" />
          </div>
          <p className="text-sm text-neutral-600">Total Orders</p>
          <p className="font-heading font-bold text-2xl text-neutral-900">{orders.length}</p>
        </div>
        <div className="card p-6 space-y-3 border-l-4 border-l-secondary">
          <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center">
            <FiDollarSign className="w-6 h-6 text-secondary-700" />
          </div>
          <p className="text-sm text-neutral-600">Revenue</p>
          <p className="font-heading font-bold text-2xl text-neutral-900">{formatCurrency(totalRevenue)}</p>
        </div>
        <div className="card p-6 space-y-3 border-l-4 border-l-blue-500">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <FiUsers className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-sm text-neutral-600">Reviews</p>
          <p className="font-heading font-bold text-2xl text-neutral-900">{reviews.length}</p>
        </div>
        <div className="card p-6 space-y-3 border-l-4 border-l-purple-500">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            <FiPieChart className="w-6 h-6 text-purple-600" />
          </div>
          <p className="text-sm text-neutral-600">Pending Orders</p>
          <p className="font-heading font-bold text-2xl text-neutral-900">{pendingOrders}</p>
        </div>
      </div>

      {/* Extended Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="card p-4 space-y-2 border-l-4 border-l-green-500">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <FiCheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-xs text-neutral-600">Completed</p>
          <p className="font-heading font-bold text-xl text-neutral-900">{completedOrders}</p>
        </div>
        <div className="card p-4 space-y-2 border-l-4 border-l-yellow-500">
          <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
            <FiMessageSquare className="w-5 h-5 text-yellow-600" />
          </div>
          <p className="text-xs text-neutral-600">Messages</p>
          <p className="font-heading font-bold text-xl text-neutral-900">{messages.length}</p>
        </div>
        <div className="card p-4 space-y-2 border-l-4 border-l-orange-500">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <FiTag className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-xs text-neutral-600">Coupons</p>
          <p className="font-heading font-bold text-xl text-neutral-900">{couponsCount}</p>
        </div>
        <div className="card p-4 space-y-2 border-l-4 border-l-pink-500">
          <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
            <FiPackage className="w-5 h-5 text-pink-600" />
          </div>
          <p className="text-xs text-neutral-600">Products</p>
          <p className="font-heading font-bold text-xl text-neutral-900">{productsCount}</p>
        </div>
        <div className="card p-4 space-y-2 border-l-4 border-l-indigo-500">
          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
            <FiGrid className="w-5 h-5 text-indigo-600" />
          </div>
          <p className="text-xs text-neutral-600">Categories</p>
          <p className="font-heading font-bold text-xl text-neutral-900">{categoriesCount}</p>
        </div>
        <div className="card p-4 space-y-2 border-l-4 border-l-teal-500">
          <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
            <FiTruck className="w-5 h-5 text-teal-600" />
          </div>
          <p className="text-xs text-neutral-600">Free Delivery</p>
          <p className="font-heading font-bold text-xl text-neutral-900">Rs 2500+</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/admin/orders" className="card p-6 hover:shadow-lg transition-shadow group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center group-hover:bg-primary-200 transition-colors">
              <FiPackage className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-neutral-900">Manage Orders</h3>
              <p className="text-sm text-neutral-500">{pendingOrders} pending orders</p>
            </div>
          </div>
        </Link>
        <Link to="/admin/messages" className="card p-6 hover:shadow-lg transition-shadow group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
              <FiMessageSquare className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-neutral-900">Messages</h3>
              <p className="text-sm text-neutral-500">{unreadMessages} unread messages</p>
            </div>
          </div>
        </Link>
        <Link to="/admin/reviews" className="card p-6 hover:shadow-lg transition-shadow group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
              <FiStar className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-neutral-900">Reviews</h3>
              <p className="text-sm text-neutral-500">{reviews.length} total reviews</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Notifications Card */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
          <h2 className="font-heading font-semibold text-lg text-neutral-900">Recent Notifications</h2>
          <Link to="/admin" className="text-sm text-primary-600 hover:underline">View All</Link>
        </div>
        <div className="divide-y divide-neutral-100">
          {latestNotifications.length === 0 ? (
            <p className="text-sm text-neutral-500 text-center py-6">No notifications yet</p>
          ) : (
            latestNotifications.map((n) => (
              <Link
                key={n.id}
                to={n.link || getNotificationLink(n.type)}
                className={`flex items-start gap-3 px-6 py-3 hover:bg-neutral-50 transition-colors ${
                  !n.read ? 'bg-primary-50/30' : ''
                }`}
              >
                <div className="shrink-0 text-lg">{getNotificationIcon(n.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900">{n.title}</p>
                  <p className="text-xs text-neutral-500 truncate">{n.message}</p>
                </div>
                <p className="text-[10px] text-neutral-400 shrink-0">{formatDateTime(n.time)}</p>
                {!n.read && <div className="w-2 h-2 bg-primary rounded-full shrink-0 mt-1" />}
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
          <h2 className="font-heading font-semibold text-lg text-neutral-900">Recent Orders</h2>
          <Link to="/admin/orders" className="text-sm text-primary-600 hover:underline">View All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Order</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Total</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase hidden sm:table-cell">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3 text-sm font-medium text-neutral-900">{order.id}</td>
                  <td className="px-4 py-3 text-sm text-neutral-600">{formatCurrency(order.total)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
                      order.status === 'completed' ? 'bg-green-100 text-green-700' :
                      order.status === 'preparing' ? 'bg-primary-100 text-primary-700' :
                      order.status === 'ready' ? 'bg-blue-100 text-blue-700' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {order.status === 'completed' ? <FiCheckCircle className="w-3 h-3" /> :
                       order.status === 'preparing' ? <FiClock className="w-3 h-3" /> :
                       order.status === 'ready' ? <FiPackage className="w-3 h-3" /> :
                       order.status === 'cancelled' ? <FiXCircle className="w-3 h-3" /> :
                       <FiClock className="w-3 h-3" />}
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-500 hidden sm:table-cell">{formatDateTime(order.createdAt)}</td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-sm text-neutral-500">No orders yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Admin
