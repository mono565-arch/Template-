import { useState } from 'react'
import { FiShoppingCart, FiStar } from 'react-icons/fi'

interface ProductCardProps {
  name: string
  description: string
  price: number
  rating: number
  image: string
  sizes?: { size: 'Small' | 'Medium' | 'Large'; price: number }[]
  onAddToCart?: () => void
}

const ProductCard = ({ name, description, price, rating, image, sizes, onAddToCart }: ProductCardProps) => {
  const [selectedSize, setSelectedSize] = useState(sizes && sizes.length > 0 ? sizes[1] : null)

  const displayPrice = selectedSize ? selectedSize.price : price

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart()
    }
  }

  return (
    <div className="group bg-white rounded-2xl border border-neutral-200 shadow-sm hover:shadow-xl hover:border-primary-200 transition-all duration-300 overflow-hidden">
      <div className="relative h-48 sm:h-52 bg-neutral-100 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm">
          <FiStar className="w-3.5 h-3.5 text-primary fill-primary" />
          <span className="text-xs font-semibold text-neutral-800">{rating}</span>
        </div>
      </div>
      <div className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-heading font-semibold text-base text-neutral-900 group-hover:text-primary-700 transition-colors">
            {name}
          </h3>
          <span className="text-primary-700 font-bold text-lg shrink-0">Rs {displayPrice}</span>
        </div>
        <p className="text-neutral-500 text-sm line-clamp-2">{description}</p>

        {sizes && sizes.length > 0 && (
          <div className="flex gap-2">
            {sizes.map((s) => (
              <button
                key={s.size}
                onClick={() => setSelectedSize(s)}
                className={`px-3 py-1 text-xs font-medium rounded-lg border transition-colors ${
                  selectedSize?.size === s.size
                    ? 'bg-primary text-neutral-900 border-primary'
                    : 'bg-white text-neutral-600 border-neutral-200 hover:border-primary-300'
                }`}
              >
                {s.size}
              </button>
            ))}
          </div>
        )}

        <button
          onClick={handleAddToCart}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-neutral-900 font-semibold text-sm rounded-xl hover:bg-primary-600 transition-colors"
        >
          <FiShoppingCart className="w-4 h-4" />
          Add to Cart
        </button>
      </div>
    </div>
  )
}

export default ProductCard
