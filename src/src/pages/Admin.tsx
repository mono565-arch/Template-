import { useState, useEffect, useMemo } from 'react'
import {
  FiShoppingBag,
  FiDollarSign,
  FiUsers,
  FiPackage,
  FiClock,
  FiTrendingUp,
  FiTrendingDown,
  FiArrowUpRight,
  FiCalendar,
} from 'react-icons/fi'

interface PlacedOrder {
  id: string
  customer: string
  total: number
  status: string
  date: string
  read: boolean
  items: { name: string; quantity: number; price: number }[]
}

const Admin = () => {
  const [orders, setOrders] = useState<PlacedOrder[]>([])
  const [todayRevenue, setTodayRevenue] = useState(0)

  useEffect(() => {
    const stored = localStorage.getItem('pizzaSaucyOrders')
    const orderList: PlacedOrder[] = stored ? JSON.parse(stored) : []
    setOrders(orderList)

    const today = new Date().toDateString()
    const todayTotal = orderList
      .filter((o) => new Date(o.date).toDateString() === today)
      .reduce((sum, o) => sum + o.total, 0)
    setTodayRevenue(todayTotal)
  }, [])

  const stats = useMemo(() => {
    const totalOrders = orders.length
    const pendingOrders = orders.filter((o) => o.status === 'Pending').length
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0)
    const uniqueCustomers = new Set(orders.map((o) => o.customer)).size
    const totalProducts = 48

    return { totalOrders, pendingOrders, totalRevenue, uniqueCustomers, totalProducts }
  }, [orders])

  const recentOrders = useMemo(() => orders.slice(0, 5), [orders])

  const topProducts = useMemo(() => {
    const productMap = new Map<string, { name: string; count: number; revenue: number }>()
    orders.forEach((order) => {
      order.items?.forEach((item) => {
        const existing = productMap.get(item.name)
        if (existing) {
          existing.count += item.quantity
          existing.revenue += item.price * item.quantity
        } else {
          productMap.set(item.name, {
            name: item.name,
            count: item.quantity,
            revenue: item.price * item.quantity,
          })
        }
      })
    })
    return Array.from(productMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  }, [orders])

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  const getStatusStyle = (status: string) => {
    const styles: Record<string, string> = {
      Pending: 'bg-yellow-100 text-yellow-700',
      Preparing: 'bg-blue-100 text-blue-700',
      'Out for Delivery': 'bg-purple-100 text-purple-700',
      Delivered: 'bg-green-100 text-green-700',
    }
    return styles[status] || 'bg-neutral-100 text-neutral-600'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl text-neutral-900">Dashboard</h1>
          <p className="text-neutral-500 text-sm mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-neutral-500 bg-white px-3 py-2 rounded-lg border border-neutral-200">
          <FiCalendar className="w-4 h-4" />
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-neutral-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <FiShoppingBag className="w-5 h-5 text-primary-600" />
            </div>
            <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
              <FiArrowUpRight className="w-3 h-3" />
              All time
            </span>
          </div>
          <p className="text-2xl font-bold text-neutral-900">{stats.totalOrders}</p>
          <p className="text-sm text-neutral-500 mt-1">Total Orders</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-neutral-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <FiClock className="w-5 h-5 text-yellow-600" />
            </div>
            {stats.pendingOrders > 0 && (
              <span className="text-xs font-medium text-white bg-red-500 px-2 py-1 rounded-full">
                {stats.pendingOrders} pending
              </span>
            )}
          </div>
          <p className="text-2xl font-bold text-neutral-900">{stats.pendingOrders}</p>
          <p className="text-sm text-neutral-500 mt-1">Pending Orders</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-neutral-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <FiDollarSign className="w-5 h-5 text-green-600" />
            </div>
            <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
              <FiTrendingUp className="w-3 h-3" />
              Revenue
            </span>
          </div>
          <p className="text-2xl font-bold text-neutral-900">${stats.totalRevenue.toFixed(2)}</p>
          <p className="text-sm text-neutral-500 mt-1">Total Revenue</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-neutral-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FiUsers className="w-5 h-5 text-blue-600" />
            </div>
            <span className="flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
              <FiTrendingUp className="w-3 h-3" />
              Unique
            </span>
          </div>
          <p className="text-2xl font-bold text-neutral-900">{stats.uniqueCustomers}</p>
          <p className="text-sm text-neutral-500 mt-1">Customers</p>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl p-5 text-white">
          <div className="flex items-center gap-3 mb-2">
            <FiDollarSign className="w-5 h-5 text-primary-100" />
            <span className="text-sm font-medium text-primary-100">Today's Revenue</span>
          </div>
          <p className="text-3xl font-bold">${todayRevenue.toFixed(2)}</p>
          <p className="text-xs text-primary-100 mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
          </p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-neutral-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <FiPackage className="w-5 h-5 text-neutral-400" />
            <span className="text-sm font-medium text-neutral-500">Total Products</span>
          </div>
          <p className="text-3xl font-bold text-neutral-900">{stats.totalProducts}</p>
          <p className="text-xs text-neutral-400 mt-1">Active menu items</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-neutral-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <FiShoppingBag className="w-5 h-5 text-neutral-400" />
            <span className="text-sm font-medium text-neutral-500">Avg. Order Value</span>
          </div>
          <p className="text-3xl font-bold text-neutral-900">
            ${stats.totalOrders > 0 ? (stats.totalRevenue / stats.totalOrders).toFixed(2) : '0.00'}
          </p>
          <p className="text-xs text-neutral-400 mt-1">Per transaction</p>
        </div>
      </div>

      {/* Recent Orders & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
            <h2 className="font-heading font-semibold text-lg text-neutral-900">Recent Orders</h2>
            <span className="text-xs text-neutral-500">{recentOrders.length} shown</span>
          </div>
          <div className="divide-y divide-neutral-100">
            {recentOrders.length === 0 ? (
              <div className="px-5 py-8 text-center text-neutral-500 text-sm">No orders yet</div>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} className="px-5 py-3 flex items-center justify-between hover:bg-neutral-50 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-neutral-900">{order.id}</p>
                    <p className="text-xs text-neutral-500">{order.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-neutral-900">${order.total.toFixed(2)}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getStatusStyle(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Best Selling Products */}
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
            <h2 className="font-heading font-semibold text-lg text-neutral-900">Best Selling Products</h2>
            <span className="text-xs text-neutral-500">Top 5</span>
          </div>
          <div className="divide-y divide-neutral-100">
            {topProducts.length === 0 ? (
              <div className="px-5 py-8 text-center text-neutral-500 text-sm">No sales data yet</div>
            ) : (
              topProducts.map((product, index) => (
                <div key={product.name} className="px-5 py-3 flex items-center justify-between hover:bg-neutral-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </span>
                    <p className="text-sm font-medium text-neutral-900">{product.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-neutral-900">{product.count} sold</p>
                    <p className="text-xs text-neutral-500">${product.revenue.toFixed(2)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-5">
        <h2 className="font-heading font-semibold text-lg text-neutral-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <a href="/admin/orders" className="flex flex-col items-center gap-2 p-4 rounded-xl bg-neutral-50 hover:bg-primary-50 hover:border-primary-200 border border-neutral-100 transition-all">
            <FiShoppingBag className="w-6 h-6 text-primary-600" />
            <span className="text-sm font-medium text-neutral-700">View Orders</span>
          </a>
          <a href="/admin/products" className="flex flex-col items-center gap-2 p-4 rounded-xl bg-neutral-50 hover:bg-primary-50 hover:border-primary-200 border border-neutral-100 transition-all">
            <FiPackage className="w-6 h-6 text-primary-600" />
            <span className="text-sm font-medium text-neutral-700">Manage Products</span>
          </a>
          <a href="/admin/categories" className="flex flex-col items-center gap-2 p-4 rounded-xl bg-neutral-50 hover:bg-primary-50 hover:border-primary-200 border border-neutral-100 transition-all">
            <FiUsers className="w-6 h-6 text-primary-600" />
            <span className="text-sm font-medium text-neutral-700">Categories</span>
          </a>
          <a href="/admin/settings" className="flex flex-col items-center gap-2 p-4 rounded-xl bg-neutral-50 hover:bg-primary-50 hover:border-primary-200 border border-neutral-100 transition-all">
            <FiTrendingDown className="w-6 h-6 text-primary-600" />
            <span className="text-sm font-medium text-neutral-700">Settings</span>
          </a>
        </div>
      </div>
    </div>
  )
}

export default Admin