import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FiSearch, FiShoppingCart, FiEye, FiStar, FiFilter, FiX, FiTag } from 'react-icons/fi'
import ProductModal from '../components/ProductModal'
import { useCartContext } from '../context/CartContext'
import { formatCurrency } from '../utils/formatters'
import { LS_KEYS, getItem } from '../utils/localStorage'
import { menuCategories, pizzaSubCategories } from '../data'
import type { Product, PizzaSize } from '../types'

const Menu = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const categoryParam = searchParams.get('category') || 'All'

  const [activeCategory, setActiveCategory] = useState(categoryParam)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [selectedSizes, setSelectedSizes] = useState<Record<string, PizzaSize>>({})
  const [menuProducts, setMenuProducts] = useState<Product[]>([])
  const [activePizzaSub, setActivePizzaSub] = useState('Regular')
  const { addItem } = useCartContext()

  useEffect(() => {
    const stored = getItem<Product[]>(LS_KEYS.PRODUCTS, [])
    setMenuProducts(stored)
  }, [])

  useEffect(() => {
    if (categoryParam && menuCategories.includes(categoryParam)) {
      setActiveCategory(categoryParam)
    }
  }, [categoryParam])

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category)
    if (category === 'All') {
      searchParams.delete('category')
    } else {
      searchParams.set('category', category)
    }
    setSearchParams(searchParams)
  }

  const filteredProducts = useMemo(() => {
    return menuProducts.filter((product) => {
      const matchesCategory = activeCategory === 'All' || product.category === activeCategory
      const matchesSearch =
        searchQuery.trim() === '' ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [activeCategory, searchQuery, menuProducts])

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

  const getProductPrice = (product: Product) => {
    const size = selectedSizes[product.id]
    if (size && product.sizes) {
      const found = product.sizes.find((s) => s.size === size)
      if (found) return found.price
    }
    return product.price
  }

  const handleAddToCart = (product: Product) => {
    const size = selectedSizes[product.id]
    let price = product.price
    if (size && product.sizes) {
      const found = product.sizes.find((s) => s.size === size)
      if (found) price = found.price
    } else if (product.sizes && product.sizes.length > 0) {
      price = product.sizes[1].price
    }
    addItem({
      id: product.id,
      name: product.name,
      price: price,
      quantity: 1,
      image: product.image,
      size: size || (product.sizes && product.sizes.length > 0 ? product.sizes[1].size : undefined),
    })
  }

  const handleSizeSelect = (productId: string, size: PizzaSize) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }))
  }

  const renderPizzaWithSubs = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-center flex-wrap gap-2">
        {pizzaSubCategories.map((sub) => (
          <button
            key={sub}
            onClick={() => setActivePizzaSub(sub)}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              activePizzaSub === sub
                ? 'bg-primary text-neutral-900 shadow-md'
                : 'bg-white text-neutral-600 border border-neutral-200 hover:border-primary-300 hover:text-primary-700'
            }`}
          >
            {sub}
          </button>
        ))}
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts
            .filter((p) => p.subCategory === activePizzaSub || !p.subCategory)
            .map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-2xl border border-neutral-200 shadow-sm hover:shadow-xl hover:border-primary-200 transition-all duration-300 overflow-hidden flex flex-col"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {product.isPopular && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 bg-primary text-neutral-900 text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm">
                      Popular
                    </span>
                  )}
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm">
                    <FiStar className="w-3.5 h-3.5 text-primary fill-primary" />
                    <span className="text-xs font-semibold text-neutral-800">{product.rating}</span>
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div>
                      <span className="text-[10px] font-medium text-primary-600 uppercase tracking-wider">
                        {product.subCategory || 'Regular'}
                      </span>
                      <h3 className="font-heading font-semibold text-base text-neutral-900 group-hover:text-primary-700 transition-colors">
                        {product.name}
                      </h3>
                    </div>
                    <span className="text-primary-700 font-bold text-lg shrink-0">
                      {formatCurrency(getProductPrice(product))}
                    </span>
                  </div>
                  <p className="text-neutral-500 text-sm line-clamp-2 mb-4 flex-1">
                    {product.description}
                  </p>
                  {product.sizes && product.sizes.length > 0 && (
                    <div className="flex gap-2 mb-3">
                      {product.sizes.map((s) => (
                        <button
                          key={s.size}
                          onClick={() => handleSizeSelect(product.id, s.size)}
                          className={`px-2.5 py-1 text-[11px] font-medium rounded-lg border transition-colors ${
                            selectedSizes[product.id] === s.size || (!selectedSizes[product.id] && s.size === 'Medium')
                              ? 'bg-primary text-neutral-900 border-primary'
                              : 'bg-white text-neutral-600 border-neutral-200 hover:border-primary-300'
                          }`}
                        >
                          {s.size}
                        </button>
                      ))}
                    </div>
                  )}
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
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiTag className="w-10 h-10 text-neutral-400" />
          </div>
          <h3 className="font-heading font-semibold text-xl text-neutral-900 mb-2">
            No items yet
          </h3>
          <p className="text-neutral-500 text-sm max-w-md mx-auto">
            Add products in the admin panel to see them here.
          </p>
        </div>
      )}
    </div>
  )

  const renderRegularProducts = () => (
    <>
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-2xl border border-neutral-200 shadow-sm hover:shadow-xl hover:border-primary-200 transition-all duration-300 overflow-hidden flex flex-col"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                {product.isPopular && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 bg-primary text-neutral-900 text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm">
                    Popular
                  </span>
                )}
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm">
                  <FiStar className="w-3.5 h-3.5 text-primary fill-primary" />
                  <span className="text-xs font-semibold text-neutral-800">{product.rating}</span>
                </div>
              </div>
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
                    {formatCurrency(getProductPrice(product))}
                  </span>
                </div>
                <p className="text-neutral-500 text-sm line-clamp-2 mb-4 flex-1">
                  {product.description}
                </p>
                {product.sizes && product.sizes.length > 0 && (
                  <div className="flex gap-2 mb-3">
                    {product.sizes.map((s) => (
                      <button
                        key={s.size}
                        onClick={() => handleSizeSelect(product.id, s.size)}
                        className={`px-2.5 py-1 text-[11px] font-medium rounded-lg border transition-colors ${
                          selectedSizes[product.id] === s.size || (!selectedSizes[product.id] && s.size === 'Medium')
                            ? 'bg-primary text-neutral-900 border-primary'
                            : 'bg-white text-neutral-600 border-neutral-200 hover:border-primary-300'
                        }`}
                      >
                        {s.size}
                      </button>
                    ))}
                  </div>
                )}
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
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiTag className="w-10 h-10 text-neutral-400" />
          </div>
          <h3 className="font-heading font-semibold text-xl text-neutral-900 mb-2">
            No items yet
          </h3>
          <p className="text-neutral-500 text-sm max-w-md mx-auto">
            Add products in the admin panel to see them here.
          </p>
        </div>
      )}
    </>
  )

  return (
    <div className="space-y-8 lg:space-y-12">
      <section className="text-center space-y-4 pt-4">
        <h1 className="section-title">Our Menu</h1>
        <p className="section-subtitle max-w-2xl mx-auto">
          Explore our delicious selection of handcrafted dishes made with love and the freshest ingredients.
        </p>
      </section>

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
      </div>

      <div className="hidden md:flex items-center justify-center flex-wrap gap-2">
        {menuCategories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryChange(category)}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeCategory === category
                ? 'bg-primary text-neutral-900 shadow-md'
                : 'bg-white text-neutral-600 border border-neutral-200 hover:border-primary-300 hover:text-primary-700'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

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
                  handleCategoryChange(category)
                  setShowMobileFilters(false)
                }}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeCategory === category
                    ? 'bg-primary text-neutral-900'
                    : 'bg-white text-neutral-600 border border-neutral-200 hover:border-primary-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}
      </div>

      {activeCategory === 'Pizza' && renderPizzaWithSubs()}
      {(activeCategory === 'All' || activeCategory !== 'Pizza') && renderRegularProducts()}

      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={closeModal}
        onAddToCart={handleAddToCart}
        selectedSize={selectedProduct ? selectedSizes[selectedProduct.id] : undefined}
        onSizeSelect={(size) => selectedProduct && handleSizeSelect(selectedProduct.id, size)}
      />
    </div>
  )
}

export default Menu