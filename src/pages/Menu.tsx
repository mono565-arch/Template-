import { FiShoppingCart, FiFilter } from 'react-icons/fi'
import { useState } from 'react'

const categories = ['All', 'Pizza', 'Sides', 'Drinks', 'Desserts']

const dummyItems = [
  { id: '1', name: 'Margherita', description: 'Fresh mozzarella, tomato sauce, basil', price: 12.99, category: 'Pizza' },
  { id: '2', name: 'Pepperoni', description: 'Pepperoni, mozzarella, tomato sauce', price: 14.99, category: 'Pizza' },
  { id: '3', name: 'BBQ Chicken', description: 'Grilled chicken, BBQ sauce, red onions', price: 15.99, category: 'Pizza' },
  { id: '4', name: 'Garlic Bread', description: 'Toasted bread with garlic butter', price: 5.99, category: 'Sides' },
  { id: '5', name: 'Caesar Salad', description: 'Romaine lettuce, croutons, parmesan', price: 8.99, category: 'Sides' },
  { id: '6', name: 'Coca-Cola', description: 'Classic Coca-Cola 500ml', price: 2.99, category: 'Drinks' },
  { id: '7', name: 'Tiramisu', description: 'Classic Italian coffee dessert', price: 6.99, category: 'Desserts' },
  { id: '8', name: 'Cheesecake', description: 'New York style cheesecake', price: 7.99, category: 'Desserts' },
]

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState('All')

  const filteredItems = activeCategory === 'All'
    ? dummyItems
    : dummyItems.filter((item) => item.category === activeCategory)

  return (
    <div className="space-y-8 lg:space-y-12">
      <div className="text-center space-y-4">
        <h1 className="section-title">Our Menu</h1>
        <p className="section-subtitle max-w-2xl mx-auto">
          Explore our delicious selection of handcrafted pizzas and more.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <FiFilter className="w-4 h-4 text-neutral-500 mr-2" />
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeCategory === category
                ? 'bg-primary text-neutral-900'
                : 'bg-white text-neutral-600 border border-neutral-200 hover:border-primary hover:text-primary'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <div key={item.id} className="card group hover:shadow-lg transition-shadow">
            <div className="h-40 bg-neutral-100 rounded-t-xl flex items-center justify-center">
              <span className="text-4xl">🍕</span>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-heading font-semibold text-lg">{item.name}</h3>
                <span className="text-primary-700 font-bold text-lg">${item.price}</span>
              </div>
              <p className="text-neutral-600 text-sm">{item.description}</p>
              <button className="btn-primary w-full text-sm py-2.5">
                <FiShoppingCart className="w-4 h-4" />
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Menu
