import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiUser, FiMail, FiLock, FiUserPlus, FiEye, FiEyeOff } from 'react-icons/fi'
import { routes } from '../constants/routes'

interface StoredUser {
  name: string
  email: string
  password: string
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
  const [showPassword, setShowPassword] = useState(false)
  const [registerError, setRegisterError] = useState('')

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setRegisterError('')
    if (validate()) {
      const usersJson = localStorage.getItem('pizzaSaucyUsers')
      const users: StoredUser[] = usersJson ? JSON.parse(usersJson) : []

      // Check for duplicate email
      if (users.some((u) => u.email === formData.email)) {
        setRegisterError('An account with this email already exists')
        return
      }

      const newUser: StoredUser = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      }

      users.push(newUser)
      localStorage.setItem('pizzaSaucyUsers', JSON.stringify(users))

      navigate(routes.LOGIN)
    }
  }

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' })
    }
    if (registerError) {
      setRegisterError('')
    }
  }

  return (
    <div className="max-w-md mx-auto py-8">
      <div className="card p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="font-heading font-bold text-2xl">Create Account</h1>
          <p className="text-neutral-600 text-sm">Join Pizza Saucy today</p>
        </div>

        {registerError && (
          <p className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">{registerError}</p>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">
              Full Name
            </label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value })
                  clearError('name')
                }}
                className={`input pl-10 ${errors.name ? 'border-red-400 focus:ring-red-400' : ''}`}
                placeholder="John Doe"
              />
            </div>
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
              Email
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value })
                  clearError('email')
                }}
                className={`input pl-10 ${errors.email ? 'border-red-400 focus:ring-red-400' : ''}`}
                placeholder="your@email.com"
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1">
              Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value })
                  clearError('password')
                }}
                className={`input pl-10 pr-10 ${errors.password ? 'border-red-400 focus:ring-red-400' : ''}`}
                placeholder="Create a password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) => {
                  setFormData({ ...formData, confirmPassword: e.target.value })
                  clearError('confirmPassword')
                }}
                className={`input pl-10 ${errors.confirmPassword ? 'border-red-400 focus:ring-red-400' : ''}`}
                placeholder="Confirm your password"
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          <button type="submit" className="btn-primary w-full">
            <FiUserPlus className="w-4 h-4" />
            Create Account
          </button>
        </form>

        <div className="text-center text-sm text-neutral-600">
          Already have an account?{' '}
          <Link to={routes.LOGIN} className="text-primary-600 font-medium hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Register