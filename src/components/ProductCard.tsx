import { useState } from 'react'
import { FiShoppingCart, FiStar } from 'react-icons/fi'
import { formatCurrency } from '../utils/formatters'

interface ProductCardProps {
  name: string
  description: string
  price: number
  rating: number
  image: string
  sizes?: { size: 'Small' | 'Medium' | 'Large'; price: number }[]
  onAddToCart?: () => void
}

const ProductCard = ({
  name,
  description,
  price,
  rating,
  image,
  sizes,
  onAddToCart,
}: ProductCardProps) => {
  const [selectedSize, setSelectedSize] = useState(
    sizes && sizes.length > 0 ? sizes[0] : null
  )

  const displayPrice = selectedSize ? selectedSize.price : price

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart()
    }
  }

  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-sm font-medium">
          <FiStar className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
          {rating}
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-neutral-900">{name}</h3>
          <p className="text-sm text-neutral-500 line-clamp-2 mt-1">{description}</p>
        </div>

        {sizes && sizes.length > 0 && (
          <div className="flex gap-2">
            {sizes.map((size) => (
              <button
                key={size.size}
                onClick={() => setSelectedSize(size)}
                className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                  selectedSize?.size === size.size
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-neutral-600 border-neutral-200 hover:border-primary'
                }`}
              >
                {size.size}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <p className="text-lg font-bold text-primary">{formatCurrency(displayPrice)}</p>
          <button
            onClick={handleAddToCart}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium"
          >
            <FiShoppingCart className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard