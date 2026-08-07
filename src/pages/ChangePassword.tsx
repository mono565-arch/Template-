import { useState } from 'react'
import { FiLock, FiEye, FiEyeOff, FiCheckCircle, FiAlertCircle, FiArrowLeft } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

const ADMIN_KEY = 'pizza_saucy_admin_password'

const ChangePassword = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  })
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  // Get stored password (default: admin123)
  const getStoredPassword = (): string => {
    const stored = localStorage.getItem(ADMIN_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        return parsed.password || parsed
      } catch {
        return stored
      }
    }
    return 'admin123' // default
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('idle')
    setMessage('')

    if (form.newPassword.length < 6) {
      setStatus('error')
      setMessage('New password must be at least 6 characters')
      return
    }
    if (form.newPassword !== form.confirmPassword) {
      setStatus('error')
      setMessage('New passwords do not match')
      return
    }
    if (form.currentPassword !== getStoredPassword()) {
      setStatus('error')
      setMessage('Current password is incorrect')
      return
    }

    // Save to SAME key
    localStorage.setItem(ADMIN_KEY, JSON.stringify({ password: form.newPassword }))

    setStatus('success')
    setMessage('Password changed successfully!')
    setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <button
        onClick={() => navigate('/admin')}
        className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 mb-6 transition-colors"
      >
        <FiArrowLeft className="w-4 h-4" />
        Back to Admin
      </button>

      <div className="card p-6 lg:p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
            <FiLock className="w-6 h-6 text-primary-600" />
          </div>
          <h2 className="font-heading font-bold text-xl text-neutral-900">Change Password</h2>
          <p className="text-sm text-neutral-500">Secure your admin panel</p>
        </div>

        {status !== 'idle' && (
          <div className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
            status === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {status === 'success' ? <FiCheckCircle /> : <FiAlertCircle />}
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPassword.current ? 'text' : 'password'}
                value={form.currentPassword}
                onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
                className="input w-full pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                {showPassword.current ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword.new ? 'text' : 'password'}
                value={form.newPassword}
                onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                className="input w-full pr-10"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                {showPassword.new ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showPassword.confirm ? 'text' : 'password'}
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                className="input w-full pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                {showPassword.confirm ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-primary w-full">
            <FiLock className="w-4 h-4" />
            Update Password
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChangePassword