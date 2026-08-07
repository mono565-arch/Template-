import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import { db } from '../firebase/firebase'
import { useCartContext } from '../context/CartContext'
import { addNotification } from '../utils/notifications'
import { formatCurrency } from '../utils/formatters'
import { FiShoppingCart, FiPlus, FiSearch, FiTag } from 'react-icons/fi'
import type { Product } from '../types'
import type { Deal } from '../data'

// Unified item type for display
interface MenuItem {
  id: string
  name: string
  description?: string
  price: number
  image?: string
  category: string
  isAvailable?: boolean
  sizes?: any[]
  ingredients?: string[]
  isPopular?: boolean
  isDeal?: boolean
  dealItems?: string[]
  source: 'product' | 'deal'
}

const Menu = () => {
  const { addItem } = useCartContext()
  const [searchParams, setSearchParams] = useSearchParams()
  const [items, setItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  // Get category from URL
  useEffect(() => {
    const cat = searchParams.get('category')
    if (cat) setActiveCategory(cat)
  }, [searchParams])

  // Fetch categories
  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'categories'), orderBy('name')),
      (snapshot) => {
        const cats = snapshot.docs.map((d) => d.data().name as string)
        setCategories(cats)
      }
    )
    return () => unsubscribe()
  }, [])

  // Fetch BOTH products and deals, merge them
  useEffect(() => {
    setLoading(true)
    let productsData: MenuItem[] = []
    let dealsData: MenuItem[] = []

    const unsubProducts = onSnapshot(
      query(collection(db, 'products'), orderBy('name')),
      (snapshot) => {
        productsData = snapshot.docs.map((d) => {
          const data = d.data() as Product
          return {
            ...data,
            id: d.id,
            category: data.category || 'Uncategorized',
            isDeal: false,
            source: 'product' as const,
          }
        })

        const merged = [...productsData, ...dealsData].filter((i) => i.isAvailable !== false)
        setItems(merged)
        setLoading(false)
      },
      (err) => {
        console.error('Products error:', err)
        setLoading(false)
      }
    )

    const unsubDeals = onSnapshot(
      query(collection(db, 'deals'), orderBy('name')),
      (snapshot) => {
        dealsData = snapshot.docs.map((d) => {
          const data = d.data() as Deal
          return {
            id: d.id,
            name: data.name,
            description: data.description,
            price: data.price,
            image: data.image,
            category: 'Deals',
            isAvailable: true,
            isDeal: true,
            dealItems: data.items,
            source: 'deal' as const,
          }
        })

        const merged = [...productsData, ...dealsData].filter((i) => i.isAvailable !== false)
        setItems(merged)
        setLoading(false)
      },
      (err) => {
        console.error('Deals error:', err)
        setLoading(false)
      }
    )

    return () => {
      unsubProducts()
      unsubDeals()
    }
  }, [])

  // Filter logic
  const filteredItems = items.filter((item) => {
    if (activeCategory !== 'All') {
      if (activeCategory === 'Deals') {
        if (!item.isDeal) return false
      } else {
        if (item.category !== activeCategory) return false
      }
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      return (
        item.name.toLowerCase().includes(q) ||
        (item.description || '').toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      )
    }
    return true
  })

  const handleAddToCart = (item: MenuItem) => {
    try {
      const cartItem = {
        ...item,
        cartPrice: item.sizes && item.sizes.length > 0 ? item.sizes[0].price : item.price,
        quantity: 1,
      }
      addItem(cartItem as any)
      addNotification({
        type: 'success',
        title: 'Added to Cart',
        message: `${item.name} added to your cart!`,
      })
    } catch (err) {
      addNotification({ type: 'error', title: 'Error', message: 'Could not add to cart' })
    }
  }

  // 🔥 FIX: Remove duplicate "Deals" — only add if not in Firestore categories
  const hasDealsCategory = categories.some((c) => c.toLowerCase() === 'deals')
  const tabs = ['All', ...(hasDealsCategory ? [] : ['Deals']), ...categories]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center space-y-2 pt-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">Our Menu</h1>
        <p className="text-neutral-500 text-sm sm:text-base">Explore our delicious offerings</p>
      </div>

      {/* Search */}
      <div className="relative max-w-md mx-auto">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
        <input
          type="text"
          placeholder="Search items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
        />
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveCategory(tab)
              if (tab === 'All') {
                searchParams.delete('category')
              } else {
                searchParams.set('category', tab)
              }
              setSearchParams(searchParams)
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategory === tab
                ? 'bg-primary text-neutral-900'
                : 'bg-white border border-neutral-200 text-neutral-600 hover:border-primary hover:text-primary'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16">
          <FiTag className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
          <p className="text-neutral-500">No items found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredItems.map((item) => (
            <div
              key={`${item.source}-${item.id}`}
              className="bg-white rounded-xl border border-neutral-200 overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
            >
              <div className="relative h-44 sm:h-48 bg-neutral-100">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-400">
                    <FiTag className="w-10 h-10" />
                  </div>
                )}
                {item.isDeal && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    DEAL
                  </span>
                )}
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur text-neutral-900 text-xs font-bold px-2 py-1 rounded-full">
                  {formatCurrency(item.price)}
                </div>
              </div>

              <div className="p-4 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-neutral-900 text-sm sm:text-base">{item.name}</h3>
                </div>
                <p className="text-neutral-500 text-xs sm:text-sm line-clamp-2 mb-3 flex-1">
                  {item.description || item.category}
                </p>

                {item.dealItems && item.dealItems.length > 0 && (
                  <div className="mb-3 space-y-1">
                    {item.dealItems.map((di, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-xs text-neutral-600">
                        <span className="w-1 h-1 bg-primary rounded-full flex-shrink-0" />
                        <span className="line-clamp-1">{di}</span>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => handleAddToCart(item)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-neutral-900 text-sm font-semibold rounded-xl hover:bg-primary-600 transition-colors active:scale-95"
                >
                  <FiPlus className="w-4 h-4" />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Menu