import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiEdit3,
  FiPackage,
  FiClock,
  FiCheckCircle,
  FiTruck,
  FiXCircle,
  FiSave,
  FiX,
  FiCamera,
} from 'react-icons/fi'

interface UserData {
  name: string
  email: string
  phone: string
  address: string
  avatar?: string
}

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [userData, setUserData] = useState<UserData>({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+92 300 1234567',
    address: '123 Pizza Lane, Lahore',
  })

  const [editForm, setEditForm] = useState<UserData>(userData)

  const [orders] = useState([
    { id: 'ORD-001', date: '2024-07-15', total: 45.97, status: 'Delivered', items: 3 },
    { id: 'ORD-002', date: '2024-07-20', total: 28.99, status: 'Preparing', items: 2 },
    { id: 'ORD-003', date: '2024-07-25', total: 62.50, status: 'Pending', items: 4 },
    { id: 'ORD-004', date: '2024-07-28', total: 15.99, status: 'Ready', items: 1 },
  ])

  // Load user data from localStorage on mount
  useEffect(() => {
    const auth = localStorage.getItem('pizzaSaucyAuth')
    const storedProfile = localStorage.getItem('pizzaSaucyProfile')
    
    if (auth) {
      const parsed = JSON.parse(auth)
      const baseData: UserData = {
        name: parsed.name || 'John Doe',
        email: parsed.email || 'john.doe@example.com',
        phone: '+92 300 1234567',
        address: '123 Pizza Lane, Lahore',
      }
      
      if (storedProfile) {
        const profile = JSON.parse(storedProfile)
        setUserData({ ...baseData, ...profile })
        setEditForm({ ...baseData, ...profile })
      } else {
        setUserData(baseData)
        setEditForm(baseData)
      }
    }
  }, [])

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

  const handleSave = () => {
    setUserData(editForm)
    localStorage.setItem('pizzaSaucyProfile', JSON.stringify(editForm))
    
    // Also update auth name if changed
    const auth = localStorage.getItem('pizzaSaucyAuth')
    if (auth) {
      const parsed = JSON.parse(auth)
      parsed.name = editForm.name
      localStorage.setItem('pizzaSaucyAuth', JSON.stringify(parsed))
    }
    
    setSaveMessage('Profile updated successfully!')
    setIsEditing(false)
    setTimeout(() => setSaveMessage(''), 3000)
  }

  const handleCancel = () => {
    setEditForm(userData)
    setIsEditing(false)
    setSaveMessage('')
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result as string
        setEditForm({ ...editForm, avatar: base64 })
      }
      reader.readAsDataURL(file)
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

      {saveMessage && (
        <div className="max-w-3xl mx-auto">
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
            <FiCheckCircle className="w-4 h-4" />
            {saveMessage}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Profile Info */}
        <div className="lg:col-span-1">
          <div className="card p-6 space-y-6">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                {isEditing && editForm.avatar ? (
                  <img
                    src={editForm.avatar}
                    alt="Preview"
                    className="w-24 h-24 rounded-full object-cover border-4 border-primary-200"
                  />
                ) : userData.avatar ? (
                  <img
                    src={userData.avatar}
                    alt={userData.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-primary-200"
                  />
                ) : (
                  <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center border-4 border-primary-200">
                    <FiUser className="w-12 h-12 text-primary-600" />
                  </div>
                )}
                {isEditing && (
                  <label className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-neutral-900 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-primary-600 transition-colors">
                    <FiCamera className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              
              {!isEditing ? (
                <div className="text-center">
                  <h2 className="font-heading font-semibold text-lg text-neutral-900">{userData.name}</h2>
                  <p className="text-neutral-500 text-sm">Customer</p>
                </div>
              ) : (
                <div className="w-full">
                  <label className="block text-xs font-medium text-neutral-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="input w-full text-sm"
                  />
                </div>
              )}
            </div>

            <div className="border-t border-neutral-200 pt-4 space-y-3">
              <div className="flex items-center gap-3">
                <FiMail className="w-5 h-5 text-primary-600 shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-neutral-500">Email</p>
                  {!isEditing ? (
                    <p className="font-medium text-sm text-neutral-900">{userData.email}</p>
                  ) : (
                    <input
                      type="email"
                      value={editForm.email}
                      disabled
                      className="input w-full text-sm bg-neutral-100 text-neutral-500"
                      title="Email cannot be changed"
                    />
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <FiPhone className="w-5 h-5 text-primary-600 shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-neutral-500">Phone</p>
                  {!isEditing ? (
                    <p className="font-medium text-sm text-neutral-900">{userData.phone}</p>
                  ) : (
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="input w-full text-sm"
                    />
                  )}
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <FiMapPin className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-neutral-500">Address</p>
                  {!isEditing ? (
                    <p className="font-medium text-sm text-neutral-900">{userData.address}</p>
                  ) : (
                    <textarea
                      value={editForm.address}
                      onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                      rows={3}
                      className="input w-full text-sm resize-none"
                    />
                  )}
                </div>
              </div>
            </div>

            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="btn-outline w-full"
              >
                <FiEdit3 className="w-4 h-4" />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-100 text-neutral-700 font-medium text-sm rounded-xl hover:bg-neutral-200 transition-colors"
                >
                  <FiX className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 btn-primary"
                >
                  <FiSave className="w-4 h-4" />
                  Save
                </button>
              </div>
            )}
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