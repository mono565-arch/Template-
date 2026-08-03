import { useState } from 'react'
import { FiEye, FiCheckCircle, FiClock, FiTruck, FiXCircle, FiPackage } from 'react-icons/fi'

interface Order {
  id: string
  customer: string
  phone: string
  items: number
  total: number
  status: 'Pending' | 'Confirmed' | 'Preparing' | 'Ready' | 'Delivered' | 'Cancelled'
  date: string
}

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([
    { id: 'ORD-001', customer: 'John Doe', phone: '+92 300 1234567', items: 3, total: 45.97, status: 'Delivered', date: '2024-07-15' },
    { id: 'ORD-002', customer: 'Jane Smith', phone: '+92 300 7654321', items: 2, total: 28.99, status: 'Preparing', date: '2024-07-20' },
    { id: 'ORD-003', customer: 'Bob Johnson', phone: '+92 300 1112222', items: 4, total: 62.50, status: 'Pending', date: '2024-07-25' },
    { id: 'ORD-004', customer: 'Alice Brown', phone: '+92 300 3334444', items: 1, total: 15.99, status: 'Ready', date: '2024-07-26' },
    { id: 'ORD-005', customer: 'Charlie Wilson', phone: '+92 300 5556666', items: 2, total: 34.49, status: 'Cancelled', date: '2024-07-27' },
    { id: 'ORD-006', customer: 'Diana Prince', phone: '+92 300 7778888', items: 5, total: 78.95, status: 'Confirmed', date: '2024-07-28' },
  ])

  const [filterStatus, setFilterStatus] = useState<string>('All')

  const statusOptions = ['All', 'Pending', 'Confirmed', 'Preparing', 'Ready', 'Delivered', 'Cancelled']

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered': return <FiCheckCircle className="w-4 h-4" />
      case 'Preparing': return <FiClock className="w-4 h-4" />
      case 'Ready': return <FiTruck className="w-4 h-4" />
      case 'Pending': return <FiPackage className="w-4 h-4" />
      case 'Confirmed': return <FiCheckCircle className="w-4 h-4" />
      case 'Cancelled': return <FiXCircle className="w-4 h-4" />
      default: return <FiPackage className="w-4 h-4" />
    }
  }

  const getStatusStyle = (status: string) => {
    const styles: Record<string, string> = {
      Pending: 'bg-yellow-100 text-yellow-700',
      Confirmed: 'bg-blue-100 text-blue-700',
      Preparing: 'bg-primary-100 text-primary-700',
      Ready: 'bg-purple-100 text-purple-700',
      Delivered: 'bg-green-100 text-green-700',
      Cancelled: 'bg-red-100 text-red-700',
    }
    return styles[status] || 'bg-neutral-100 text-neutral-600'
  }

  const updateStatus = (id: string, newStatus: Order['status']) => {
    setOrders(orders.map((o) => (o.id === id ? { ...o, status: newStatus } : o)))
  }

  const filteredOrders = filterStatus === 'All' ? orders : orders.filter((o) => o.status === filterStatus)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="font-heading font-semibold text-lg">Orders ({filteredOrders.length})</h2>
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
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-neutral-900">{order.id}</p>
                    <p className="text-xs text-neutral-500">{order.items} items</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-neutral-900">{order.customer}</p>
                    <p className="text-xs text-neutral-500">{order.phone}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-600 hidden sm:table-cell">{order.date}</td>
                  <td className="px-4 py-3 text-sm font-medium text-neutral-900">${order.total.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusStyle(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value as Order['status'])}
                      className="text-xs border border-neutral-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-400"
                    >
                      {statusOptions.filter(s => s !== 'All').map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminOrders
