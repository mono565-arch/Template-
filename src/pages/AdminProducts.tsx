import { useState, useEffect } from 'react'
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiX,
  FiCheck,
} from 'react-icons/fi'
import { getItem, setItem, LS_KEYS } from '../utils/localStorage'
import { getCategories } from '../utils/categories'
import { addNotification } from '../utils/notifications'
import type { Product } from '../data'

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [categories, setCategories] = useState(() => getCategories())

  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    rating: 4.5,
    image: '',
    category: '',
    ingredients: [],
    isPopular: false,
    isAvailable: true,
    isFeatured: false,
    sizes: undefined,
  })

  const [smallPrice, setSmallPrice] = useState('')
  const [mediumPrice, setMediumPrice] = useState('')
  const [largePrice, setLargePrice] = useState('')

  useEffect(() => {
    const interval = setInterval(() => {
      setCategories(getCategories())
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = () => {
    const stored = getItem<Product[]>(LS_KEYS.PRODUCTS, [])
    setProducts(stored)
  }

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      rating: 4.5,
      image: '',
      category: '',
      ingredients: [],
      isPopular: false,
      isAvailable: true,
      isFeatured: false,
      sizes: undefined,
    })
    setSmallPrice('')
    setMediumPrice('')
    setLargePrice('')
    setEditingProduct(null)
  }

  const openAddModal = () => {
    resetForm()
    setIsModalOpen(true)
  }

  const openEditModal = (product: Product) => {
    setEditingProduct(product)
    setFormData({ ...product })
    if (product.sizes && product.sizes.length > 0) {
      const small = product.sizes.find((s) => s.size === 'Small')
      const medium = product.sizes.find((s) => s.size === 'Medium')
      const large = product.sizes.find((s) => s.size === 'Large')
      setSmallPrice(small ? String(small.price) : '')
      setMediumPrice(medium ? String(medium.price) : '')
      setLargePrice(large ? String(large.price) : '')
    } else {
      setSmallPrice('')
      setMediumPrice('')
      setLargePrice('')
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    resetForm()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.category) {
      addNotification({
        type: 'product_added',
        title: 'Validation Error',
        message: 'Name and category are required',
      })
      return
    }

    const isPizza = formData.category === 'Pizza'

    let sizes:
      | { size: 'Small' | 'Medium' | 'Large'; price: number }[]
      | undefined

    if (isPizza) {
      const sPrice = parseFloat(smallPrice)
      const mPrice = parseFloat(mediumPrice)
      const lPrice = parseFloat(largePrice)

      if (
        isNaN(sPrice) ||
        isNaN(mPrice) ||
        isNaN(lPrice) ||
        sPrice <= 0 ||
        mPrice <= 0 ||
        lPrice <= 0
      ) {
        addNotification({
          type: 'product_added',
          title: 'Validation Error',
          message: 'Please enter valid prices for all pizza sizes',
        })
        return
      }

      sizes = [
        { size: 'Small', price: sPrice },
        { size: 'Medium', price: mPrice },
        { size: 'Large', price: lPrice },
      ]
    }

    const productData: Product = {
      id: editingProduct ? editingProduct.id : `prod_${Date.now()}`,
      name: formData.name || '',
      description: formData.description || '',
      price:
        isPizza && sizes ? sizes[1].price : formData.price || 0,
      rating: formData.rating || 4.5,
      image: formData.image || '',
      category: formData.category || '',
      ingredients: formData.ingredients || [],
      isPopular: formData.isPopular || false,
      isAvailable: formData.isAvailable !== false,
      isFeatured: formData.isFeatured || false,
      sizes: sizes,
    }

    let updated: Product[]
    if (editingProduct) {
      updated = products.map((p) =>
        p.id === editingProduct.id ? productData : p
      )
      addNotification({
        type: 'product_updated',
        title: 'Product Updated',
        message: `${productData.name} has been updated successfully`,
      })
    } else {
      updated = [...products, productData]
      addNotification({
        type: 'product_added',
        title: 'Product Added',
        message: `${productData.name} has been added successfully`,
      })
    }

    setItem(LS_KEYS.PRODUCTS, updated)
    setProducts(updated)
    closeModal()
  }

  const handleDelete = (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?'))
      return
    const product = products.find((p) => p.id === id)
    const updated = products.filter((p) => p.id !== id)
    setItem(LS_KEYS.PRODUCTS, updated)
    setProducts(updated)
    addNotification({
      type: 'product_deleted',
      title: 'Product Deleted',
      message: product ? `${product.name} has been deleted` : 'Product has been deleted',
    })
  }

  const isPizzaCategory = formData.category === 'Pizza'

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Products</h1>
          <p className="text-neutral-500 mt-1">Manage your menu items</p>
        </div>
        <button
          onClick={openAddModal}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <FiPlus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-700">
                  Product
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-700">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-700">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-700">
                  Featured
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-700">
                  Available
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-neutral-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {product.image && (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                      )}
                      <div>
                        <p className="font-medium text-neutral-900">
                          {product.name}
                        </p>
                        <p className="text-xs text-neutral-500 line-clamp-1">
                          {product.description}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-600">
                    {product.category}
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-600">
                    {product.sizes && product.sizes.length > 0
                      ? `${product.sizes[0].price} - ${product.sizes[2]?.price || product.sizes[product.sizes.length - 1].price}`
                      : product.price}
                  </td>
                  <td className="px-4 py-3">
                    {product.isFeatured ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                        <FiCheck className="w-3 h-3" /> Yes
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-neutral-100 text-neutral-500 text-xs rounded-full">
                        <FiX className="w-3 h-3" /> No
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {product.isAvailable !== false ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-600 text-xs rounded-full">
                        <FiCheck className="w-3 h-3" /> Yes
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-50 text-red-600 text-xs rounded-full">
                        <FiX className="w-3 h-3" /> No
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(product)}
                        className="p-2 text-neutral-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-neutral-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-neutral-500"
                  >
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-neutral-100">
              <h2 className="text-xl font-bold text-neutral-900">
                {editingProduct ? 'Edit Product' : 'Add Product'}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 text-neutral-400 hover:text-neutral-600 rounded-lg transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Rating
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={formData.rating}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        rating: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                {/* Pizza Size Prices */}
                {isPizzaCategory && (
                  <div className="sm:col-span-2 grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Small Price *
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={smallPrice}
                        onChange={(e) => setSmallPrice(e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="e.g. 899"
                        required={isPizzaCategory}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Medium Price *
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={mediumPrice}
                        onChange={(e) => setMediumPrice(e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="e.g. 1299"
                        required={isPizzaCategory}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Large Price *
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={largePrice}
                        onChange={(e) => setLargePrice(e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="e.g. 1699"
                        required={isPizzaCategory}
                      />
                    </div>
                  </div>
                )}

                {/* Single Price for non-Pizza */}
                {!isPizzaCategory && (
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Price *
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={formData.price || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          price: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required={!isPizzaCategory}
                    />
                  </div>
                )}

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Ingredients (comma separated)
                  </label>
                  <input
                    type="text"
                    value={(formData.ingredients || []).join(', ')}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        ingredients: e.target.value
                          .split(',')
                          .map((i) => i.trim())
                          .filter(Boolean),
                      })
                    }
                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div className="sm:col-span-2 flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isPopular || false}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isPopular: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-primary rounded border-neutral-300 focus:ring-primary"
                    />
                    <span className="text-sm text-neutral-700">Popular</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isAvailable !== false}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isAvailable: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-primary rounded border-neutral-300 focus:ring-primary"
                    />
                    <span className="text-sm text-neutral-700">
                      Available
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured || false}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isFeatured: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-primary rounded border-neutral-300 focus:ring-primary"
                    />
                    <span className="text-sm text-neutral-700 font-medium">
                      Featured Product
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminProducts