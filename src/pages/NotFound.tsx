import { Link } from 'react-router-dom'
import { FiHome, FiAlertTriangle } from 'react-icons/fi'
import { routes } from '../constants/routes'

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 lg:py-32 space-y-8">
      <div className="relative">
        <div className="w-28 h-28 bg-primary-100 rounded-full flex items-center justify-center">
          <FiAlertTriangle className="w-14 h-14 text-primary-600" />
        </div>
        <div className="absolute -top-2 -right-2 w-10 h-10 bg-primary rounded-full flex items-center justify-center">
          <span className="text-neutral-900 font-bold text-sm">!</span>
        </div>
      </div>
      <div className="text-center space-y-4 max-w-lg">
        <h1 className="font-heading font-bold text-8xl sm:text-9xl text-neutral-200">404</h1>
        <h2 className="font-heading font-semibold text-2xl sm:text-3xl text-neutral-900 -mt-4">
          Page Not Found
        </h2>
        <p className="text-neutral-600 text-base sm:text-lg">
          Oops! The page you are looking for seems to have vanished into thin air. It might have been moved, deleted, or never existed.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Link to={routes.HOME} className="btn-primary">
          <FiHome className="w-4 h-4" />
          Back to Home
        </Link>
        <Link to={routes.MENU} className="btn-outline">
          Browse Menu
        </Link>
      </div>
    </div>
  )
}

export default NotFound
