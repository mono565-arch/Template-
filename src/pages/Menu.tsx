import { useState, useMemo } from 'react'
import { FiSearch, FiX, FiSliders, FiShoppingCart, FiEye, FiStar } from 'react-icons/fi'
import { products, menuCategories } from '../data'
import { useCartContext } from '../context/CartContext'
import ProductModal from '../components/ProductModal'
import type { Product } from '../data'

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const { addItem } = useCartContext()

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = activeCategory === 'All' || product.category === activeCategory
      const matchesSearch =
        searchQuery.trim() === '' ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [activeCategory, searchQuery])

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: products.length }
    menuCategories.forEach((cat) => {
      if (cat !== 'All') {
        counts[cat] = products.filter((p) => p.category === cat).length
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
    <div className="min-h-screen bg-neutral-50">
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-neutral-900 text-center">
            Our Menu
          </h2>
          <p className="text-neutral-500 text-center mt-3 max-w-xl mx-auto">
            Explore our delicious selection of handcrafted dishes made with love and the freshest ingredients.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative max-w-xl mx-auto mb-8">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
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
              className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
            >
              <FiX className="w-5 h-5" />
            </button>
          )}
        </div>

        {searchQuery && (
          <p className="text-sm text-neutral-500 mb-4 text-center">
            {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''} for "{searchQuery}"
          </p>
        )}

        <div className="hidden sm:flex items-center justify-center gap-2 mb-8 flex-wrap">
          {menuCategories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === category
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
              }`}
            >
              {category}
              <span className="ml-1.5 text-xs opacity-70">({categoryCounts[category]})</span>
            </button>
          ))}
        </div>

        <div className="sm:hidden mb-6">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-neutral-200 rounded-xl text-sm font-medium text-neutral-700"
          >
            <FiSliders className="w-4 h-4" />
            {activeCategory}
          </button>
          {showMobileFilters && (
            <div className="mt-2 bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-lg">
              {menuCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setActiveCategory(category)
                    setShowMobileFilters(false)
                  }}
                  className={`w-full px-4 py-3 text-left text-sm ${
                    activeCategory === category
                      ? 'bg-primary-50 text-primary font-medium'
                      : 'text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  {category} ({categoryCounts[category]})
                </button>
              ))}
            </div>
          )}
        </div>

        <p className="text-sm text-neutral-500 mb-6">
          Showing {filteredProducts.length} items
          {activeCategory !== 'All' && (
            <span> in {activeCategory}</span>
          )}
        </p>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-2xl border border-neutral-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.isPopular && (
                      <span className="px-2.5 py-1 bg-primary text-white text-xs font-semibold rounded-full">
                        Popular
                      </span>
                    )}
                    {product.isAvailable === false && (
                      <span className="px-2.5 py-1 bg-neutral-500 text-white text-xs font-semibold rounded-full">
                        Unavailable
                      </span>
                    )}
                  </div>
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full">
                    <FiStar className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-xs font-semibold text-neutral-800">{product.rating}</span>
                  </div>
                </div>

                <div className="p-5">
                  <p className="text-xs font-medium text-primary uppercase tracking-wide mb-1">
                    {product.category}
                  </p>
                  <h3 className="font-heading font-semibold text-lg text-neutral-900 mb-1">
                    {product.name}
                  </h3>
                  <p className="text-neutral-500 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xl text-neutral-900">
                      ${product.price.toFixed(2)}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openModal(product)}
                        className="p-2.5 rounded-xl bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-colors"
                        title="Quick View"
                      >
                        <FiEye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="p-2.5 rounded-xl bg-primary text-white hover:bg-primary-600 transition-colors"
                        title="Add to Cart"
                      >
                        <FiShoppingCart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiSearch className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="font-heading font-semibold text-lg text-neutral-900 mb-2">
              No items found
            </h3>
            <p className="text-neutral-500 max-w-md mx-auto">
              We could not find any items matching your search. Try adjusting your filters or search terms.
            </p>
          </div>
        )}
      </div>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={closeModal}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  )
}

export default Menu