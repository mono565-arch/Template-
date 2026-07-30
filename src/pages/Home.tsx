import { Link } from 'react-router-dom'
import { FiArrowRight, FiStar, FiClock, FiTruck } from 'react-icons/fi'
import { routes } from '../constants/routes'

const Home = () => {
  return (
    <div className="space-y-16 lg:space-y-24">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-8 lg:py-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-sm font-medium">
          <FiStar className="w-4 h-4" />
          Best Pizza in Town
        </div>
        <h1 className="section-title max-w-3xl mx-auto">
          Delicious Pizza <span className="text-primary-600">Delivered</span> to Your Door
        </h1>
        <p className="section-subtitle max-w-xl mx-auto">
          Hand-tossed dough, fresh ingredients, and authentic Italian flavors. Order now and taste the difference.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link to={routes.MENU} className="btn-primary w-full sm:w-auto">
            Order Now
            <FiArrowRight className="w-4 h-4" />
          </Link>
          <Link to={routes.ABOUT} className="btn-outline w-full sm:w-auto">
            Learn More
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
        <div className="card p-6 lg:p-8 text-center space-y-4">
          <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mx-auto">
            <FiClock className="w-7 h-7 text-primary-600" />
          </div>
          <h3 className="font-heading font-semibold text-lg">Fast Delivery</h3>
          <p className="text-neutral-600 text-sm">
            Hot and fresh pizza delivered to your doorstep in under 30 minutes.
          </p>
        </div>
        <div className="card p-6 lg:p-8 text-center space-y-4">
          <div className="w-14 h-14 bg-secondary-100 rounded-xl flex items-center justify-center mx-auto">
            <FiStar className="w-7 h-7 text-secondary-700" />
          </div>
          <h3 className="font-heading font-semibold text-lg">Premium Quality</h3>
          <p className="text-neutral-600 text-sm">
            Only the freshest ingredients sourced from local farms and Italian suppliers.
          </p>
        </div>
        <div className="card p-6 lg:p-8 text-center space-y-4">
          <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mx-auto">
            <FiTruck className="w-7 h-7 text-primary-600" />
          </div>
          <h3 className="font-heading font-semibold text-lg">Free Shipping</h3>
          <p className="text-neutral-600 text-sm">
            Free delivery on all orders over $25. No hidden fees, ever.
          </p>
        </div>
      </section>
    </div>
  )
}

export default Home
