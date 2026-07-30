import { Link } from 'react-router-dom'
import { FiUser, FiMail, FiLock, FiUserPlus } from 'react-icons/fi'
import { routes } from '../constants/routes'

const Register = () => {
  return (
    <div className="max-w-md mx-auto">
      <div className="card p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="font-heading font-bold text-2xl">Create Account</h1>
          <p className="text-neutral-600 text-sm">Join Pizza Saucy today</p>
        </div>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">
              Full Name
            </label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                id="name"
                className="input pl-10"
                placeholder="John Doe"
              />
            </div>
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
                className="input pl-10"
                placeholder="your@email.com"
              />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1">
              Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="password"
                id="password"
                className="input pl-10"
                placeholder="Create a password"
              />
            </div>
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
                className="input pl-10"
                placeholder="Confirm your password"
              />
            </div>
          </div>
          <button type="submit" className="btn-primary w-full">
            <FiUserPlus className="w-4 h-4" />
            Create Account
          </button>
        </form>

        <div className="text-center">
          <p className="text-sm text-neutral-600">
            Already have an account?{' '}
            <Link to={routes.LOGIN} className="text-primary-600 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
