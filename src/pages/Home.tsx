import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiArrowRight, FiStar, FiClock } from 'react-icons/fi'
import { routes } from '../constants/routes'
import SectionTitle from '../components/SectionTitle'
import CategoryCard from '../components/CategoryCard'
import ProductCard from '../components/ProductCard'
import ReviewCard from '../components/ReviewCard'
import MapPlaceholder from '../components/MapPlaceholder'
import { featuredProducts, reviews } from '../data'
import { useCartContext } from '../context/CartContext'
import { getCategories } from '../utils/categories'
import { formatCurrency } from '../utils/formatters'

const Home = () => {
  const navigate = useNavigate()
  const { addItem } = useCartContext()
  const [categories, setCategories] = useState(() => getCategories())

  useEffect(() => {
    const interval = setInterval(() => {
      setCategories(getCategories())
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const handleCategoryClick = (categoryName: string) => {
    navigate(`${routes.MENU}?category=${encodeURIComponent(categoryName)}`)
  }

  const handleAddToCart = (product: typeof featuredProducts[0]) => {
    const price = product.sizes && product.sizes.length > 0
      ? product.sizes[1].price
      : product.price
    addItem({
      id: product.id,
      name: product.name,
      price: price,
      quantity: 1,
      image: product.image,
      size: product.sizes && product.sizes.length > 0 ? product.sizes[1].size : undefined,
    })
  }

  return (
    <div>
      {/* 1. Hero Section - Dark background with gradient blobs */}
      <section className="relative overflow-hidden bg-neutral-900">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center py-16 sm:py-20 lg:py-28">
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                <FiStar className="w-4 h-4" />
                Best Pizza in Town
              </div>
              <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl text-white leading-tight">
                Delicious Pizza{' '}
                <span className="text-primary">Delivered</span> to Your Door
              </h1>
              <p className="text-white/70 text-lg max-w-lg mx-auto lg:mx-0">
                Hand-tossed dough, fresh ingredients, and authentic Italian flavors. Order now and taste the difference.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button
                  onClick={() => handleCategoryClick('Pizza')}
                  className="btn-primary w-full sm:w-auto text-base px-8 py-4"
                >
                  Order Now
                  <FiArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => navigate(routes.MENU)}
                  className="btn-outline w-full sm:w-auto text-base px-8 py-4 border-white/30 text-white hover:bg-white hover:text-neutral-900"
                >
                  View Menu
                </button>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-6 pt-2">
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <FiClock className="w-4 h-4 text-primary" />
                  30 min delivery
                </div>
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <FiStar className="w-4 h-4 text-primary" />
                  4.9 rating
                </div>
              </div>
            </div>
            <div className="relative flex justify-center lg:justify-end">
              <button
                onClick={() => handleCategoryClick('Pizza')}
                className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96 group cursor-pointer"
                aria-label="Browse Pizza Menu"
              >
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-colors" />
                <img
                  src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=600&fit=crop"
                  alt="Delicious Pizza"
                  className="relative w-full h-full object-cover rounded-full border-4 border-primary/30 shadow-2xl group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute -top-2 -right-2 bg-white rounded-xl px-4 py-2 shadow-lg">
                  <p className="text-xs text-neutral-500">Starting from</p>
                  <p className="font-bold text-primary-700 text-lg">{formatCurrency(899)}</p>
                </div>
                <div className="absolute -bottom-2 -left-2 bg-white rounded-xl px-4 py-2 shadow-lg">
                  <p className="text-xs text-neutral-500">Free Delivery</p>
                  <p className="font-bold text-secondary-700 text-sm">On orders {formatCurrency(2500)}+</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Categories - White background with container */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="Browse Categories"
            subtitle="Explore our wide range of delicious food categories"
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                icon={category.icon}
                title={category.name}
                onClick={() => handleCategoryClick(category.name)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 3. Featured Products - Light warm background */}
      <section className="py-16 sm:py-20 lg:py-24 bg-primary-50/50">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="Featured Products"
            subtitle="Our most popular and loved dishes, handcrafted with care"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                name={product.name}
                description={product.description}
                price={product.price}
                rating={product.rating}
                image={product.image}
                sizes={product.sizes}
                onAddToCart={() => handleAddToCart(product)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Customer Reviews - Warm background */}
      <section className="py-16 sm:py-20 lg:py-24 bg-secondary-50/30">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="What Our Customers Say"
            subtitle="Real reviews from real food lovers"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                name={review.name}
                review={review.review}
                rating={review.rating}
                avatar={review.avatar}
                role={review.role}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Google Maps Placeholder - White background */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="Find Us in Lahore"
            subtitle="Come experience our warm hospitality and delicious food in person"
          />
          <MapPlaceholder
            title="Pizza Saucy Location"
            description="Google Maps will be connected here soon."
          />
        </div>
      </section>
    </div>
  )
}

export default Home
