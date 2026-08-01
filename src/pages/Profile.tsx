import { useState } from 'react'
import { FiUser, FiMail, FiPhone, FiMapPin, FiEdit3, FiPackage, FiClock, FiCheckCircle, FiTruck, FiXCircle } from 'react-icons/fi'

const Profile = () => {
  const [orders] = useState([
    { id: 'ORD-001', date: '2024-07-15', total: 45.97, status: 'Delivered', items: 3 },
    { id: 'ORD-002', date: '2024-07-20', total: 28.99, status: 'Preparing', items: 2 },
    { id: 'ORD-003', date: '2024-07-25', total: 62.50, status: 'Pending', items: 4 },
    { id: 'ORD-004', date: '2024-07-28', total: 15.99, status: 'Ready', items: 1 },
  ])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered':
        return <FiCheckCircle className="w-4 h-4 text-green-500" />
      case 'Preparing':
        return <FiClock className="w-4 h-4 text-primary" />
      case 'Ready':
        return <FiTruck className="w-4 h-4 text-blue-500" />
      case 'Pending':
        return <FiPackage className="w-4 h-4 text-neutral-400" />
      case 'Cancelled':
        return <FiXCircle className="w-4 h-4 text-red-500" />
      default:
        return <FiPackage className="w-4 h-4 text-neutral-400" />
    }
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-700'
      case 'Preparing':
        return 'bg-primary-100 text-primary-700'
      case 'Ready':
        return 'bg-blue-100 text-blue-700'
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700'
      case 'Cancelled':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-neutral-100 text-neutral-600'
    }
  }

  return (
    <div className="space-y-8 lg:space-y-12">
      {/* Header */}
      <section className="text-center space-y-4 pt-4">
        <h1 className="section-title">My Profile</h1>
        <p className="section-subtitle max-w-2xl mx-auto">
          Manage your account information and view your order history.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="lg:col-span-1">
          <div className="card p-6 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                <FiUser className="w-8 h-8 text-primary-600" />
              </div>
              <div>
                <h2 className="font-heading font-semibold text-lg text-neutral-900">John Doe</h2>
                <p className="text-neutral-500 text-sm">Customer</p>
              </div>
            </div>

            <div className="border-t border-neutral-200 pt-4 space-y-3">
              <div className="flex items-center gap-3">
                <FiMail className="w-5 h-5 text-primary-600 shrink-0" />
                <div>
                  <p className="text-xs text-neutral-500">Email</p>
                  <p className="font-medium text-sm text-neutral-900">john.doe@example.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FiPhone className="w-5 h-5 text-primary-600 shrink-0" />
                <div>
                  <p className="text-xs text-neutral-500">Phone</p>
                  <p className="font-medium text-sm text-neutral-900">+92 300 1234567</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FiMapPin className="w-5 h-5 text-primary-600 shrink-0" />
                <div>
                  <p className="text-xs text-neutral-500">Address</p>
                  <p className="font-medium text-sm text-neutral-900">123 Pizza Lane, Lahore</p>
                </div>
              </div>
            </div>

            <button className="btn-outline w-full">
              <FiEdit3 className="w-4 h-4" />
              Edit Profile
            </button>
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
                          {order.date} · {order.items} item{order.items !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm text-neutral-900">
                        ${order.total.toFixed(2)}
                      </p>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusStyle(
                          order.status
                        )}`}
                      >
                        {order.status}
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
