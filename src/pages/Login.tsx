import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiMail, FiLock, FiLogIn, FiEye, FiEyeOff } from 'react-icons/fi'
import { routes } from '../constants/routes'
import { authService } from '../services/api'

const getFriendlyError = (err: unknown): { message: string; type: 'error' | 'warning' } => {
  if (err instanceof Error) {
    const msg = err.message.toLowerCase()
    if (msg.includes('invalid-credential') || msg.includes('invalid-login-credentials')) {
      return { message: 'Invalid email or password. Please try again.', type: 'error' }
    }
    if (msg.includes('user-not-found')) {
      return { message: 'No account found with this email. Please register first.', type: 'warning' }
    }
    if (msg.includes('wrong-password')) {
      return { message: 'Incorrect password. Please try again.', type: 'error' }
    }
    if (msg.includes('too-many-requests')) {
      return { message: 'Too many failed attempts. Please try again later.', type: 'warning' }
    }
    if (msg.includes('user-disabled')) {
      return { message: 'This account has been disabled. Contact support.', type: 'error' }
    }
    if (msg.includes('network-request-failed')) {
      return { message: 'Network error. Please check your internet connection.', type: 'warning' }
    }
    if (msg.includes('invalid-email')) {
      return { message: 'Please enter a valid email address.', type: 'error' }
    }
  }
  return { message: 'Something went wrong. Please try again.', type: 'error' }
}

const Login = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState<{ message: string; type: 'error' | 'warning' } | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return

    setError(null)
    setLoading(true)

    if (!formData.email.trim() || !formData.password) {
      setError({ message: 'Please fill in all fields.', type: 'error' })
      setLoading(false)
      return
    }

    try {
      const user = await authService.login(formData.email, formData.password)
      
      // Save complete user to localStorage
      const userToStore = {
        id: user?.id || '',
        email: user?.email || formData.email,
        name: user?.name || formData.email.split('@')[0],
        role: user?.role || 'customer',
      }
      localStorage.setItem('pizza_saucy_user', JSON.stringify(userToStore))

      // 🔥 FIX: Navigate instead of reload — Navbar auth listener catch kar lega
      navigate(routes.PROFILE, { replace: true })
    } catch (err: unknown) {
      console.error('Login error:', err)
      setError(getFriendlyError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto py-8 px-4">
      <div className="card p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="font-heading font-bold text-2xl">Welcome Back</h1>
          <p className="text-neutral-600 text-sm">Login to your Pizza Saucy account</p>
        </div>

        {error && (
          <div className={`text-sm text-center p-3 rounded-lg ${
            error.type === 'warning' ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-700'
          }`}>
            {error.message}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input pl-10"
                placeholder="your@email.com"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Password</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="input pl-10 pr-10"
                placeholder="Enter your password"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                disabled={loading}
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                Logging in...
              </span>
            ) : (
              <><FiLogIn className="w-4 h-4" /> Login</>
            )}
          </button>
        </form>

        <div className="text-center text-sm text-neutral-600">
          Don't have an account?{' '}
          <Link to={routes.REGISTER} className="text-primary-600 font-medium hover:underline">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login