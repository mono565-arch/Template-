import { useState, useMemo } from 'react'
import { FiSearch, FiShoppingCart, FiEye, FiStar, FiFilter, FiX } from 'react-icons/fi'
import SectionTitle from '../components/SectionTitle'
import ProductModal from '../components/ProductModal'
import { useCartContext } from '../context/CartContext'
import { menuCategories, menuProducts } from '../data'
import type { Product } from '../data'

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const { addItem } = useCartContext()

  // Filter products by category and search
  const filteredProducts = useMemo(() => {
    return menuProducts.filter((product) => {
      const matchesCategory = activeCategory === 'All' || product.category === activeCategory
      const matchesSearch =
        searchQuery.trim() === '' ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [activeCategory, searchQuery])

  // Count products per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: menuProducts.length }
    menuCategories.forEach((cat) => {
      if (cat !== 'All') {
        counts[cat] = menuProducts.filter((p) => p.category === cat).length
      }
    })
    return counts
  }, [])

  const openModal = (product: Product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedProduct(null), 200)
  }

  const clearSearch = () => {
    setSearchQuery('')
  }

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    })
  }

  return (
    <div className="space-y-8 lg:space-y-12">
      {/* Header */}
      <section className="text-center space-y-4 pt-4">
        <h1 className="section-title">Our Menu</h1>
        <p className="section-subtitle max-w-2xl mx-auto">
          Explore our delicious selection of handcrafted dishes made with love and the freshest ingredients.
        </p>
      </section>

      {/* Search Bar */}
      <div className="max-w-xl mx-auto">
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for food, category, or ingredients..."
            className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-neutral-200 bg-white text-neutral-900 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent shadow-sm transition-all"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 bg-neutral-200 rounded-full flex items-center justify-center hover:bg-neutral-300 transition-colors"
              aria-label="Clear search"
            >
              <FiX className="w-3.5 h-3.5 text-neutral-600" />
            </button>
          )}
        </div>
        {searchQuery && (
          <p className="text-sm text-neutral-500 mt-2 text-center">
            {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''} for &ldquo;{searchQuery}&rdquo;
          </p>
        )}
      </div>

      {/* Category Tabs - Desktop */}
      <div className="hidden md:flex items-center justify-center flex-wrap gap-2">
        {menuCategories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeCategory === category
                ? 'bg-primary text-neutral-900 shadow-md'
                : 'bg-white text-neutral-600 border border-neutral-200 hover:border-primary-300 hover:text-primary-700'
            }`}
          >
            {category}
            <span
              className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                activeCategory === category
                  ? 'bg-neutral-900/10 text-neutral-900'
                  : 'bg-neutral-100 text-neutral-500'
              }`}
            >
              {categoryCounts[category] || 0}
            </span>
          </button>
        ))}
      </div>

      {/* Category Tabs - Mobile */}
      <div className="md:hidden">
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-neutral-200 rounded-xl text-sm font-medium text-neutral-700 hover:border-primary-300 transition-colors"
        >
          <FiFilter className="w-4 h-4" />
          {showMobileFilters ? 'Hide Filters' : 'Filter by Category'}
          <span className="ml-1 text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">
            {activeCategory}
          </span>
        </button>

        {showMobileFilters && (
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
            {menuCategories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setActiveCategory(category)
                  setShowMobileFilters(false)
                }}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeCategory === category
                    ? 'bg-primary text-neutral-900'
                    : 'bg-white text-neutral-600 border border-neutral-200 hover:border-primary-300'
                }`}
              >
                {category}
                <span className="ml-1.5 text-xs opacity-70">
                  ({categoryCounts[category] || 0})
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-500">
          Showing <span className="font-semibold text-neutral-700">{filteredProducts.length}</span> items
          {activeCategory !== 'All' && (
            <span> in <span className="font-semibold text-neutral-700">{activeCategory}</span></span>
          )}
        </p>
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-2xl border border-neutral-200 shadow-sm hover:shadow-xl hover:border-primary-200 transition-all duration-300 overflow-hidden flex flex-col"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  {product.isPopular && (
                    <span className="px-2.5 py-1 bg-primary text-neutral-900 text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm">
                      Popular
                    </span>
                  )}
                  {product.isAvailable === false && (
                    <span className="px-2.5 py-1 bg-red-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm">
                      Unavailable
                    </span>
                  )}
                </div>
                {/* Rating Badge */}
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm">
                  <FiStar className="w-3.5 h-3.5 text-primary fill-primary" />
                  <span className="text-xs font-semibold text-neutral-800">{product.rating}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div>
                    <span className="text-[10px] font-medium text-primary-600 uppercase tracking-wider">
                      {product.category}
                    </span>
                    <h3 className="font-heading font-semibold text-base text-neutral-900 group-hover:text-primary-700 transition-colors">
                      {product.name}
                    </h3>
                  </div>
                  <span className="text-primary-700 font-bold text-lg shrink-0">
                    ${product.price.toFixed(2)}
                  </span>
                </div>
                <p className="text-neutral-500 text-sm line-clamp-2 mb-4 flex-1">
                  {product.description}
                </p>

                {/* Actions */}
                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() => openModal(product)}
                    className="flex items-center justify-center gap-1.5 px-3 py-2.5 border border-neutral-200 text-neutral-700 text-xs font-semibold rounded-xl hover:border-primary-300 hover:text-primary-700 transition-colors flex-1"
                  >
                    <FiEye className="w-3.5 h-3.5" />
                    Details
                  </button>
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.isAvailable === false}
                    className={`flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-semibold rounded-xl flex-1 transition-colors ${
                      product.isAvailable === false
                        ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                        : 'bg-primary text-neutral-900 hover:bg-primary-600'
                    }`}
                  >
                    <FiShoppingCart className="w-3.5 h-3.5" />
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiSearch className="w-10 h-10 text-neutral-400" />
          </div>
          <h3 className="font-heading font-semibold text-xl text-neutral-900 mb-2">
            No items found
          </h3>
          <p className="text-neutral-500 text-sm max-w-md mx-auto mb-6">
            We could not find any items matching your search. Try adjusting your filters or search terms.
          </p>
          <button
            onClick={() => {
              setActiveCategory('All')
              setSearchQuery('')
            }}
            className="btn-primary"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Product Details Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={closeModal}
        onAddToCart={handleAddToCart}
      />
    </div>
  )
}

export default Menu
