import { useState, useEffect } from 'react'
import { FiUsers, FiShoppingBag, FiDollarSign, FiPieChart, FiBell } from 'react-icons/fi'

interface PlacedOrder {
  id: string
  customer: string
  total: number
  status: string
  date: string
  read: boolean
}

const Admin = () => {
  const [orders, setOrders] = useState<PlacedOrder[]>([])
  const [stats, setStats] = useState({
    totalOrders: 0,
    revenue: 0,
    customers: 0,
    menuItems: 48,
    unreadOrders: 0,
  })

  useEffect(() => {
    const stored = localStorage.getItem('pizzaSaucyOrders')
    const orderList: PlacedOrder[] = stored ? JSON.parse(stored) : []
    setOrders(orderList)

    const totalRevenue = orderList.reduce((sum, o) => sum + o.total, 0)
    const uniqueCustomers = new Set(orderList.map((o) => o.customer)).size
    const unread = orderList.filter((o) => !o.read).length

    setStats({
      totalOrders: orderList.length,
      revenue: totalRevenue,
      customers: uniqueCustomers,
      menuItems: 48,
      unreadOrders: unread,
    })
  }, [])

  const recentOrders = orders.slice(0, 5)

  return (
    <div className="space-y-8 lg:space-y-12">
      <div className="text-center space-y-4">
        <h1 className="section-title">Admin Dashboard</h1>
        <p className="section-subtitle max-w-2xl mx-auto">
          Overview of your restaurant performance.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6 space-y-3">
          <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
            <FiShoppingBag className="w-6 h-6 text-primary-600" />
          </div>
          <p className="text-sm text-neutral-600">Total Orders</p>
          <p className="font-heading font-bold text-2xl text-neutral-900">{stats.totalOrders}</p>
        </div>
        <div className="card p-6 space-y-3">
          <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center">
            <FiDollarSign className="w-6 h-6 text-secondary-700" />
          </div>
          <p className="text-sm text-neutral-600">Revenue</p>
          <p className="font-heading font-bold text-2xl text-neutral-900">${stats.revenue.toFixed(2)}</p>
        </div>
        <div className="card p-6 space-y-3">
          <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
            <FiUsers className="w-6 h-6 text-primary-600" />
          </div>
          <p className="text-sm text-neutral-600">Customers</p>
          <p className="font-heading font-bold text-2xl text-neutral-900">{stats.customers}</p>
        </div>
        <div className="card p-6 space-y-3">
          <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center">
            <FiPieChart className="w-6 h-6 text-secondary-700" />
          </div>
          <p className="text-sm text-neutral-600">Menu Items</p>
          <p className="font-heading font-bold text-2xl text-neutral-900">{stats.menuItems}</p>
        </div>
      </div>

      {/* Unread Orders Alert */}
      {stats.unreadOrders > 0 && (
        <div className="bg-primary-50 border border-primary-200 rounded-xl px-5 py-4 flex items-center gap-3">
          <FiBell className="w-5 h-5 text-primary-600 shrink-0" />
          <p className="text-sm text-primary-800 font-medium">
            You have {stats.unreadOrders} new order{stats.unreadOrders !== 1 ? 's' : ''} waiting for review.
          </p>
        </div>
      )}

      {/* Recent Orders */}
      {recentOrders.length > 0 && (
        <div className="card p-6 space-y-4">
          <h2 className="font-heading font-semibold text-lg text-neutral-900">Recent Orders</h2>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className={`flex items-center justify-between p-4 rounded-xl ${
                  !order.read ? 'bg-primary-50 border border-primary-100' : 'bg-neutral-50'
                }`}
              >
                <div>
                  <p className="text-sm font-medium text-neutral-900">
                    {order.id}
                    {!order.read && (
                      <span className="ml-2 text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-full">
                        NEW
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-neutral-500">{order.customer}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-neutral-900">${order.total.toFixed(2)}</p>
                  <p className="text-xs text-neutral-500">{order.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Admin
