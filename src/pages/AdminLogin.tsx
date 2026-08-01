import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiLock, FiUser, FiLogIn } from 'react-icons/fi'

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (credentials.username === 'admin' && credentials.password === 'admin123') {
      localStorage.setItem('adminAuth', 'true')
      navigate('/admin')
    } else {
      setError('Invalid username or password')
    }
  }

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="font-heading font-bold text-2xl text-neutral-900">Admin Login</h1>
          <p className="text-neutral-600 text-sm">Pizza Saucy Management</p>
        </div>
        {error && (
          <p className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">{error}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Username</label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                className="input pl-10"
                placeholder="admin"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Password</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className="input pl-10"
                placeholder="admin123"
              />
            </div>
          </div>
          <button type="submit" className="btn-primary w-full">
            <FiLogIn className="w-4 h-4" />
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin
