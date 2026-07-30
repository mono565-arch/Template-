import { FiUser, FiMail, FiPhone, FiMapPin, FiEdit3 } from 'react-icons/fi'

const Profile = () => {
  return (
    <div className="space-y-8 lg:space-y-12">
      <div className="text-center space-y-4">
        <h1 className="section-title">My Profile</h1>
        <p className="section-subtitle max-w-2xl mx-auto">
          Manage your account information and preferences.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="card p-8 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <FiUser className="w-8 h-8 text-primary-600" />
            </div>
            <div>
              <h2 className="font-heading font-semibold text-xl">John Doe</h2>
              <p className="text-neutral-600 text-sm">Customer</p>
            </div>
          </div>

          <div className="border-t border-neutral-200 pt-6 space-y-4">
            <div className="flex items-center gap-4">
              <FiMail className="w-5 h-5 text-primary-600" />
              <div>
                <p className="text-sm text-neutral-500">Email</p>
                <p className="font-medium text-neutral-900">john.doe@example.com</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <FiPhone className="w-5 h-5 text-primary-600" />
              <div>
                <p className="text-sm text-neutral-500">Phone</p>
                <p className="font-medium text-neutral-900">+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <FiMapPin className="w-5 h-5 text-primary-600" />
              <div>
                <p className="text-sm text-neutral-500">Address</p>
                <p className="font-medium text-neutral-900">123 Pizza Lane, NY 10001</p>
              </div>
            </div>
          </div>

          <button className="btn-outline w-full">
            <FiEdit3 className="w-4 h-4" />
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  )
}

export default Profile
