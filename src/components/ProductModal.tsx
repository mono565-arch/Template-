import { useEffect, useState } from 'react'
import { FiX, FiStar, FiShoppingCart } from 'react-icons/fi'
import type { Product } from '../data'
import type { PizzaSize } from '../types'

interface ProductModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
  onAddToCart?: (product: Product) => void
  selectedSize?: PizzaSize
  onSizeSelect?: (size: PizzaSize) => void
}

const ProductModal = ({ product, isOpen, onClose, onAddToCart, selectedSize, onSizeSelect }: ProductModalProps) => {
  const [localSize, setLocalSize] = useState<PizzaSize | undefined>(selectedSize)

  useEffect(() => {
    setLocalSize(selectedSize)
  }, [selectedSize, product])

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEsc)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen || !product) return null

  const currentPrice = localSize && product.sizes
    ? product.sizes.find((s) => s.size === localSize)?.price ?? product.price
    : product.price

  const handleSizeClick = (size: PizzaSize) => {
    setLocalSize(size)
    onSizeSelect?.(size)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-neutral-100 transition-colors"
          aria-label="Close modal"
        >
          <FiX className="w-5 h-5 text-neutral-700" />
        </button>

        {/* Image */}
        <div className="relative h-64 sm:h-72">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {product.isPopular && (
            <div className="absolute top-4 left-4 px-3 py-1 bg-primary text-neutral-900 text-xs font-bold rounded-full shadow-md">
              Popular
            </div>
          )}
          {product.isAvailable === false && (
            <div className="absolute top-4 left-4 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-md">
              Out of Stock
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-xs font-medium text-primary-600 uppercase tracking-wider">
                {product.category}
              </span>
              <h2 className="font-heading font-bold text-2xl sm:text-3xl text-neutral-900 mt-1">
                {product.name}
              </h2>
            </div>
            <div className="text-right shrink-0">
              <p className="font-heading font-bold text-2xl text-primary-700">
                Rs {currentPrice}
              </p>
              <div className="flex items-center gap-1 justify-end mt-1">
                <FiStar className="w-4 h-4 text-primary fill-primary" />
                <span className="text-sm font-medium text-neutral-700">{product.rating}</span>
              </div>
            </div>
          </div>

          <p className="text-neutral-600 leading-relaxed">
            {product.description}
          </p>

          {/* Size Selector */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-heading font-semibold text-sm text-neutral-900 uppercase tracking-wider">
                Select Size
              </h3>
              <div className="flex gap-3">
                {product.sizes.map((s) => (
                  <button
                    key={s.size}
                    onClick={() => handleSizeClick(s.size)}
                    className={`flex flex-col items-center px-4 py-2.5 rounded-xl border transition-all ${
                      localSize === s.size || (!localSize && product.sizes && s.size === product.sizes[0].size)
                        ? 'bg-primary text-neutral-900 border-primary shadow-sm'
                        : 'bg-white text-neutral-600 border-neutral-200 hover:border-primary-300'
                    }`}
                  >
                    <span className="text-sm font-semibold">{s.size}</span>
                    <span className="text-xs opacity-80">Rs {s.price}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.ingredients && product.ingredients.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-heading font-semibold text-sm text-neutral-900 uppercase tracking-wider">
                Ingredients
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.ingredients.map((ingredient) => (
                  <span
                    key={ingredient}
                    className="px-3 py-1.5 bg-neutral-100 text-neutral-700 text-xs font-medium rounded-lg"
                  >
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                if (localSize && onSizeSelect) {
                  onSizeSelect(localSize)
                }
                onAddToCart?.(product)
                onClose()
              }}
              disabled={product.isAvailable === false}
              className={`btn-primary flex-1 ${
                product.isAvailable === false ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <FiShoppingCart className="w-4 h-4" />
              Add to Cart
            </button>
            <button
              onClick={onClose}
              className="btn-outline flex-1"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductModal