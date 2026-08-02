import { useState, useEffect } from 'react'
import { FiEye, FiCheckCircle, FiClock, FiTruck, FiXCircle, FiPackage, FiBell, FiCheck } from 'react-icons/fi'

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

const statusOptions = ['All', 'Pending', 'Preparing', 'Out for Delivery', 'Delivered']

const AdminOrders = () => {
  const [orders, setOrders] = useState<PlacedOrder[]>([])
  const [filterStatus, setFilterStatus] = useState<string>('All')
  const [selectedOrder, setSelectedOrder] = useState<PlacedOrder | null>(null)
  const [showNotifications, setShowNotifications] = useState(false)

  // Load orders from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('pizzaSaucyOrders')
    if (stored) {
      setOrders(JSON.parse(stored))
    }
  }, [])

  // Save orders to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('pizzaSaucyOrders', JSON.stringify(orders))
  }, [orders])

  const unreadCount = orders.filter((o) => !o.read).length

  const markAsRead = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, read: true } : o))
    )
  }

  const markAllAsRead = () => {
    setOrders((prev) => prev.map((o) => ({ ...o, read: true })))
  }

  const updateStatus = (id: string, newStatus: PlacedOrder['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    )
  }

  const filteredOrders = filterStatus === 'All'
    ? orders
    : orders.filter((o) => o.status === filterStatus)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered': return <FiCheckCircle className="w-4 h-4" />
      case 'Preparing': return <FiClock className="w-4 h-4" />
      case 'Out for Delivery': return <FiTruck className="w-4 h-4" />
      case 'Pending': return <FiPackage className="w-4 h-4" />
      default: return <FiPackage className="w-4 h-4" />
    }
  }

  const getStatusStyle = (status: string) => {
    const styles: Record<string, string> = {
      Pending: 'bg-yellow-100 text-yellow-700',
      Preparing: 'bg-primary-100 text-primary-700',
      'Out for Delivery': 'bg-purple-100 text-purple-700',
      Delivered: 'bg-green-100 text-green-700',
    }
    return styles[status] || 'bg-neutral-100 text-neutral-600'
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="space-y-6">
      {/* Header with notifications */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="font-heading font-semibold text-lg">Orders ({filteredOrders.length})</h2>
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
              aria-label="Notifications"
            >
              <FiBell className="w-5 h-5 text-neutral-700" />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-neutral-200 z-50 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100">
                  <h3 className="font-semibold text-sm text-neutral-900">Notifications</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-primary-600 hover:underline flex items-center gap-1"
                    >
                      <FiCheck className="w-3 h-3" />
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {orders.filter((o) => !o.read).length === 0 ? (
                    <p className="text-sm text-neutral-500 text-center py-6">No new notifications</p>
                  ) : (
                    orders
                      .filter((o) => !o.read)
                      .map((order) => (
                        <div
                          key={order.id}
                          className="px-4 py-3 border-b border-neutral-50 hover:bg-neutral-50 cursor-pointer"
                          onClick={() => {
                            markAsRead(order.id)
                            setShowNotifications(false)
                            setSelectedOrder(order)
                          }}
                        >
                          <p className="text-sm font-medium text-neutral-900">New Order Received</p>
                          <p className="text-xs text-neutral-500">{order.id} — {order.customer}</p>
                          <p className="text-xs text-neutral-400 mt-0.5">{formatDate(order.date)}</p>
                        </div>
                      ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Status filter */}
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  filterStatus === s ? 'bg-primary text-neutral-900' : 'bg-white text-neutral-600 border border-neutral-200 hover:border-primary-300'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* New Order Banner */}
      {orders.some((o) => !o.read) && (
        <div className="bg-primary-50 border border-primary-200 rounded-xl px-4 py-3 flex items-center gap-3">
          <FiBell className="w-5 h-5 text-primary-600 shrink-0" />
          <p className="text-sm text-primary-800 font-medium">
            You have {unreadCount} new order{unreadCount !== 1 ? 's' : ''}!
          </p>
          <button
            onClick={markAllAsRead}
            className="ml-auto text-xs text-primary-700 hover:underline font-medium"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Order</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase hidden sm:table-cell">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Total</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Status</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-neutral-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-neutral-500">
                    No orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className={`hover:bg-neutral-50 ${!order.read ? 'bg-primary-50/30' : ''}`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {!order.read && (
                          <span className="w-2 h-2 bg-red-500 rounded-full shrink-0" title="Unread" />
                        )}
                        <div>
                          <p className="text-sm font-medium text-neutral-900">{order.id}</p>
                          <p className="text-xs text-neutral-500">{order.items.length} items</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-neutral-900">{order.customer}</p>
                      <p className="text-xs text-neutral-500">{order.phone}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-600 hidden sm:table-cell">{formatDate(order.date)}</td>
                    <td className="px-4 py-3 text-sm font-medium text-neutral-900">${order.total.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusStyle(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <select
                          value={order.status}
                          onChange={(e) => updateStatus(order.id, e.target.value as PlacedOrder['status'])}
                          className="text-xs border border-neutral-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-400"
                        >
                          {statusOptions.filter((s) => s !== 'All').map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => {
                            markAsRead(order.id)
                            setSelectedOrder(order)
                          }}
                          className="p-1.5 text-neutral-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="View details"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-semibold text-lg text-neutral-900">{selectedOrder.id}</h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1.5 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  <FiXCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-neutral-600"><span className="font-medium text-neutral-900">Customer:</span> {selectedOrder.customer}</p>
                <p className="text-sm text-neutral-600"><span className="font-medium text-neutral-900">Phone:</span> {selectedOrder.phone}</p>
                <p className="text-sm text-neutral-600"><span className="font-medium text-neutral-900">Address:</span> {selectedOrder.address}</p>
                {selectedOrder.notes && (
                  <p className="text-sm text-neutral-600"><span className="font-medium text-neutral-900">Notes:</span> {selectedOrder.notes}</p>
                )}
              </div>

              <div className="border-t border-neutral-200 pt-4">
                <h4 className="font-medium text-sm text-neutral-900 mb-3">Items</h4>
                <div className="space-y-2">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <span className="text-neutral-700">{item.name} x{item.quantity}</span>
                      <span className="font-medium text-neutral-900">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-neutral-200 pt-4 flex items-center justify-between">
                <span className="font-semibold text-neutral-900">Total</span>
                <span className="font-bold text-lg text-primary-700">${selectedOrder.total.toFixed(2)}</span>
              </div>

              <div className="pt-2">
                <label className="block text-xs font-medium text-neutral-700 mb-1.5">Update Status</label>
                <div className="flex gap-2 flex-wrap">
                  {statusOptions.filter((s) => s !== 'All').map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus(selectedOrder.id, s as PlacedOrder['status'])}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        selectedOrder.status === s
                          ? 'bg-primary text-neutral-900'
                          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminOrders
