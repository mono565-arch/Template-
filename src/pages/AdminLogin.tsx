import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiLock, FiUser, FiLogIn } from 'react-icons/fi'
import { adminAuthService } from '../services/adminAuth'

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const storedPassword = await adminAuthService.getPassword()
      
      if (credentials.username === 'admin' && credentials.password === storedPassword) {
        localStorage.setItem('pizza_saucy_admin_auth', 'true')
        navigate('/admin')
      } else {
        setError('Invalid username or password')
      }
    } catch (err) {
      setError('Failed to verify password. Check your connection.')
    } finally {
      setLoading(false)
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
                placeholder="Enter password"
              />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
            {loading ? 'Verifying...' : <><FiLogIn className="w-4 h-4" /> Login</>}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin