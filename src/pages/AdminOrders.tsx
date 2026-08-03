import { useState, useEffect } from 'react'
import { FiPackage, FiClock, FiCheckCircle, FiTruck, FiXCircle, FiSearch, FiRefreshCw } from 'react-icons/fi'
import { formatCurrency, formatDateTime } from '../utils/formatters'
import type { Order, OrderStatus } from '../types'

const orderStatuses: OrderStatus[] = ['pending', 'preparing', 'ready', 'completed', 'cancelled']

const statusConfig: Record<OrderStatus, { label: string; icon: typeof FiClock; style: string }> = {
  pending: { label: 'Pending', icon: FiClock, style: 'bg-yellow-100 text-yellow-700' },
  preparing: { label: 'Preparing', icon: FiRefreshCw, style: 'bg-primary-100 text-primary-700' },
  ready: { label: 'Ready', icon: FiTruck, style: 'bg-blue-100 text-blue-700' },
  completed: { label: 'Completed', icon: FiCheckCircle, style: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Cancelled', icon: FiXCircle, style: 'bg-red-100 text-red-700' },
}

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all')

  useEffect(() => {
    const load = () => {
      const stored = JSON.parse(localStorage.getItem('pizza_saucy_orders') || '[]')
      setOrders(stored.sort((a: Order, b: Order) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
    }
    load()
    const interval = setInterval(load, 2000)
    return () => clearInterval(interval)
  }, [])

  const updateStatus = (orderId: string, newStatus: OrderStatus) => {
    const updated = orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    setOrders(updated)
    localStorage.setItem('pizza_saucy_orders', JSON.stringify(updated))
  }

  const filtered = orders.filter((o) => {
    const matchesSearch =
      search.trim() === '' ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName?.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="font-heading font-bold text-2xl text-neutral-900">Orders</h1>
        <div className="flex gap-2">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search orders..."
              className="input pl-9 text-sm py-2"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
            className="input text-sm py-2"
          >
            <option value="all">All Status</option>
            {orderStatuses.map((s) => (
              <option key={s} value={s}>{statusConfig[s].label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Order ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Items</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Total</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase hidden lg:table-cell">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filtered.map((order) => {
                const StatusIcon = statusConfig[order.status].icon
                return (
                  <tr key={order.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-neutral-900">{order.id}</td>
                    <td className="px-4 py-3 text-sm text-neutral-600">{order.customerName || 'Guest'}</td>
                    <td className="px-4 py-3 text-sm text-neutral-600">{order.items.length}</td>
                    <td className="px-4 py-3 text-sm font-bold text-neutral-900">{formatCurrency(order.total)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full ${statusConfig[order.status].style}`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusConfig[order.status].label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-500 hidden lg:table-cell">{formatDateTime(order.createdAt)}</td>
                    <td className="px-4 py-3">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
                        className="input text-xs py-1.5 pr-8"
                      >
                        {orderStatuses.map((s) => (
                          <option key={s} value={s}>{statusConfig[s].label}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-sm text-neutral-500">
                    <FiPackage className="w-8 h-8 mx-auto mb-2 text-neutral-300" />
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminOrders
