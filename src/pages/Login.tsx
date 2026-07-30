import { Link } from 'react-router-dom'
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi'
import { routes } from '../constants/routes'

const Login = () => {
  return (
    <div className="max-w-md mx-auto">
      <div className="card p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="font-heading font-bold text-2xl">Welcome Back</h1>
          <p className="text-neutral-600 text-sm">Sign in to your Pizza Saucy account</p>
        </div>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
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
                placeholder="Enter your password"
              />
            </div>
          </div>
          <button type="submit" className="btn-primary w-full">
            <FiLogIn className="w-4 h-4" />
            Sign In
          </button>
        </form>

        <div className="text-center space-y-2">
          <p className="text-sm text-neutral-600">
            Do not have an account?{' '}
            <Link to={routes.REGISTER} className="text-primary-600 font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
