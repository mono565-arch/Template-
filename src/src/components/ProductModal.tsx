import { useEffect } from 'react'
import { FiX, FiStar, FiShoppingCart } from 'react-icons/fi'
import type { Product } from '../data'

interface ProductModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
  onAddToCart?: (product: Product) => void
}

const ProductModal = ({ product, isOpen, onClose, onAddToCart }: ProductModalProps) => {
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
                ${product.price.toFixed(2)}
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
