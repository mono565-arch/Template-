import { Link } from 'react-router-dom'
import { FiHome, FiAlertTriangle } from 'react-icons/fi'
import { routes } from '../constants/routes'

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 lg:py-24 space-y-6">
      <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
        <FiAlertTriangle className="w-12 h-12 text-primary-600" />
      </div>
      <div className="text-center space-y-2">
        <h1 className="font-heading font-bold text-6xl text-neutral-300">404</h1>
        <h2 className="font-heading font-semibold text-2xl text-neutral-900">Page Not Found</h2>
        <p className="text-neutral-600 max-w-md mx-auto">
          The page you are looking for does not exist or has been moved.
        </p>
      </div>
      <Link to={routes.HOME} className="btn-primary">
        <FiHome className="w-4 h-4" />
        Back to Home
      </Link>
    </div>
  )
}

export default NotFound
