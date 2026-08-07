import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiUser, FiMail, FiLock, FiUserPlus, FiEye, FiEyeOff } from 'react-icons/fi'
import { routes } from '../constants/routes'
import { authService } from '../services/api'

const getFriendlyError = (err: unknown): { message: string; type: 'error' | 'warning' } => {
  if (err instanceof Error) {
    const msg = err.message.toLowerCase()
    if (msg.includes('email-already-in-use')) {
      return { message: 'This email is already registered. Please login instead.', type: 'warning' }
    }
    if (msg.includes('weak-password')) {
      return { message: 'Password is too weak. Use at least 6 characters.', type: 'error' }
    }
    if (msg.includes('invalid-email')) {
      return { message: 'Please enter a valid email address.', type: 'error' }
    }
    if (msg.includes('network-request-failed')) {
      return { message: 'Network error. Please check your internet connection.', type: 'warning' }
    }
    if (msg.includes('too-many-requests')) {
      return { message: 'Too many attempts. Please try again later.', type: 'warning' }
    }
    if (msg.includes('invalid-credential') || msg.includes('configuration-not-found')) {
      return { message: 'Server configuration error. Please contact support.', type: 'error' }
    }
  }
  return { message: 'Something went wrong. Please try again.', type: 'error' }
}

const Register = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [generalError, setGeneralError] = useState<{ message: string; type: 'error' | 'warning' } | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address'
    }
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setGeneralError(null)
    if (!validate()) return

    setLoading(true)
    try {
      await authService.register(formData.email, formData.password, formData.name)
      // ✅ User localStorage mein save karo
      localStorage.setItem('pizza_saucy_user', JSON.stringify({ email: formData.email, name: formData.name }))
      navigate(routes.PROFILE)
    } catch (err: unknown) {
      setGeneralError(getFriendlyError(err))
    } finally {
      setLoading(false)
    }
  }

  const clearError = (field: string) => {
    if (errors[field]) setErrors({ ...errors, [field]: '' })
  }

  return (
    <div className="max-w-md mx-auto py-8">
      <div className="card p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="font-heading font-bold text-2xl">Create Account</h1>
          <p className="text-neutral-600 text-sm">Join Pizza Saucy today</p>
        </div>

        {generalError && (
          <div className={`text-sm text-center p-3 rounded-lg ${
            generalError.type === 'warning' ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-700'
          }`}>
            {generalError.message}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Full Name</label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => { setFormData({ ...formData, name: e.target.value }); clearError('name') }}
                className={`input pl-10 ${errors.name ? 'border-red-400' : ''}`}
                placeholder="Muhammad Ammad"
              />
            </div>
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => { setFormData({ ...formData, email: e.target.value }); clearError('email') }}
                className={`input pl-10 ${errors.email ? 'border-red-400' : ''}`}
                placeholder="your@email.com"
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Password</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => { setFormData({ ...formData, password: e.target.value }); clearError('password') }}
                className={`input pl-10 pr-10 ${errors.password ? 'border-red-400' : ''}`}
                placeholder="Create a password"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600">
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Confirm Password</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => { setFormData({ ...formData, confirmPassword: e.target.value }); clearError('confirmPassword') }}
                className={`input pl-10 ${errors.confirmPassword ? 'border-red-400' : ''}`}
                placeholder="Confirm your password"
              />
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
            {loading ? 'Creating Account...' : <><FiUserPlus className="w-4 h-4" /> Create Account</>}
          </button>
        </form>

        <div className="text-center text-sm text-neutral-600">
          Already have an account?{' '}
          <Link to={routes.LOGIN} className="text-primary-600 font-medium hover:underline">Sign in</Link>
        </div>
      </div>
    </div>
  )
}

export default Register