import { FiUsers, FiShoppingBag, FiDollarSign, FiPieChart } from 'react-icons/fi'

const Admin = () => {
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
          <p className="font-heading font-bold text-2xl text-neutral-900">1,234</p>
        </div>
        <div className="card p-6 space-y-3">
          <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center">
            <FiDollarSign className="w-6 h-6 text-secondary-700" />
          </div>
          <p className="text-sm text-neutral-600">Revenue</p>
          <p className="font-heading font-bold text-2xl text-neutral-900">$45,678</p>
        </div>
        <div className="card p-6 space-y-3">
          <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
            <FiUsers className="w-6 h-6 text-primary-600" />
          </div>
          <p className="text-sm text-neutral-600">Customers</p>
          <p className="font-heading font-bold text-2xl text-neutral-900">892</p>
        </div>
        <div className="card p-6 space-y-3">
          <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center">
            <FiPieChart className="w-6 h-6 text-secondary-700" />
          </div>
          <p className="text-sm text-neutral-600">Menu Items</p>
          <p className="font-heading font-bold text-2xl text-neutral-900">48</p>
        </div>
      </div>
    </div>
  )
}

export default Admin
