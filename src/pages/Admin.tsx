import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  FiUsers, FiShoppingBag, FiDollarSign, FiPieChart,
  FiBell, FiMessageSquare, FiStar, FiTrendingUp,
  FiPackage, FiClock, FiCheckCircle, FiXCircle
} from 'react-icons/fi'
import { formatCurrency, formatDateTime } from '../utils/formatters'
import type { Order, ContactMessage, Review } from '../types'

interface Notification {
  id: string
  type: 'order' | 'message' | 'review'
  title: string
  message: string
  time: string
  read: boolean
}

const Admin = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showNotifications, setShowNotifications] = useState(false)

  useEffect(() => {
    const loadData = () => {
      const storedOrders = JSON.parse(localStorage.getItem('pizza_saucy_orders') || '[]')
      const storedMessages = JSON.parse(localStorage.getItem('pizza_saucy_messages') || '[]')
      const storedReviews = JSON.parse(localStorage.getItem('pizza_saucy_reviews') || '[]')
      setOrders(storedOrders)
      setMessages(storedMessages)
      setReviews(storedReviews)

      // Build notifications
      const notifs: Notification[] = []
      storedOrders.slice(0, 5).forEach((o: Order) => {
        notifs.push({
          id: `ord-${o.id}`,
          type: 'order',
          title: 'New Order',
          message: `${o.id} - ${formatCurrency(o.total)}`,
          time: o.createdAt,
          read: false,
        })
      })
      storedMessages.filter((m: ContactMessage) => !m.read).slice(0, 5).forEach((m: ContactMessage) => {
        notifs.push({
          id: `msg-${m.id}`,
          type: 'message',
          title: 'New Message',
          message: `From ${m.name}`,
          time: m.date,
          read: false,
        })
      })
      storedReviews.slice(0, 3).forEach((r: Review) => {
        notifs.push({
          id: `rev-${r.id}`,
          type: 'review',
          title: 'New Review',
          message: `${r.rating} stars from ${r.name}`,
          time: r.date,
          read: false,
        })
      })
      setNotifications(notifs.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()))
    }
    loadData()
    const interval = setInterval(loadData, 3000)
    return () => clearInterval(interval)
  }, [])

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0)
  const pendingOrders = orders.filter((o) => o.status === 'pending').length
  const unreadMessages = messages.filter((m) => !m.read).length

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    const msgs = JSON.parse(localStorage.getItem('pizza_saucy_messages') || '[]')
    localStorage.setItem('pizza_saucy_messages', JSON.stringify(msgs.map((m: ContactMessage) => ({ ...m, read: true }))))
  }

  const unreadCount = notifications.filter((n) => !n.read).length

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
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-3 bg-neutral-800 rounded-xl text-neutral-300 hover:text-primary hover:bg-neutral-700 transition-colors"
            >
              <FiBell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            {showNotifications && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setShowNotifications(false)} />
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl border border-neutral-200 z-40 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100">
                    <h3 className="font-semibold text-sm text-neutral-900">Notifications</h3>
                    <button onClick={markAllRead} className="text-xs text-primary-600 hover:underline">
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="text-sm text-neutral-500 text-center py-6">No notifications</p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`flex items-start gap-3 px-4 py-3 border-b border-neutral-50 hover:bg-neutral-50 transition-colors ${
                            !n.read ? 'bg-primary-50/30' : ''
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            n.type === 'order' ? 'bg-blue-100 text-blue-600' :
                            n.type === 'message' ? 'bg-green-100 text-green-600' :
                            'bg-yellow-100 text-yellow-600'
                          }`}>
                            {n.type === 'order' ? <FiShoppingBag className="w-4 h-4" /> :
                             n.type === 'message' ? <FiMessageSquare className="w-4 h-4" /> :
                             <FiStar className="w-4 h-4" />}
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
              </>
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
