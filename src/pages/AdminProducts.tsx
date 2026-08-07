import { useState, useEffect } from 'react'
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiX,
  FiCheck,
  FiImage,
} from 'react-icons/fi'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import { db } from '../firebase/firebase'
import { productService } from '../services/api'
import { addNotification } from '../utils/notifications'
import type { Product, ProductSize } from '../types'

const PIZZA_SUBS = ['Regular', 'Special', 'Signature']

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    rating: 4.5,
    image: '',
    category: '',
    subCategory: '',
    ingredients: [],
    isPopular: false,
    isAvailable: true,
    sizes: undefined,
  })

  const [sizesList, setSizesList] = useState<ProductSize[]>([])

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'products'), orderBy('name')),
      (snapshot) => {
        const data = snapshot.docs.map((d) => ({ ...d.data(), id: d.id })) as Product[]
        setProducts(data)
      },
      (err) => console.error('Products error:', err)
    )
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'categories'), orderBy('name')),
      (snapshot) => {
        const cats = snapshot.docs.map((d) => d.data().name as string)
        setCategories(cats)
      },
      (err) => console.error('Categories error:', err)
    )
    return () => unsubscribe()
  }, [])

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
      subCategory: '',
      ingredients: [],
      isPopular: false,
      isAvailable: true,
      sizes: undefined,
    })
    setSizesList([])
    setEditingProduct(null)
  }

  const openAddModal = () => {
    resetForm()
    setIsModalOpen(true)
  }

  const openEditModal = (product: Product) => {
    setEditingProduct(product)
    setFormData({ ...product })
    setSizesList(product.sizes || [])
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    resetForm()
  }

  const addSize = () => setSizesList([...sizesList, { size: '', price: 0 }])
  
  const removeSize = (index: number) => setSizesList(sizesList.filter((_, i) => i !== index))
  
  const updateSize = (index: number, field: 'size' | 'price', value: string) => {
    const updated = [...sizesList]
    if (field === 'price') {
      const num = value === '' ? 0 : parseFloat(value)
      updated[index].price = isNaN(num) ? 0 : num
    } else {
      updated[index].size = value
    }
    setSizesList(updated)
  }

  // 🔥 FIX: Remove undefined values before sending to Firestore
  const buildPayload = (): Record<string, any> => {
    const validSizes = sizesList.filter((s) => s.size.trim() !== '' && s.price > 0)

    const payload: Record<string, any> = {
      name: (formData.name || '').trim(),
      description: (formData.description || '').trim(),
      price: validSizes.length > 0 ? validSizes[0].price : (formData.price || 0),
      rating: formData.rating ?? 4.5,
      image: (formData.image || '').trim(),
      category: formData.category || '',
      subCategory: formData.subCategory || '',
      ingredients: formData.ingredients || [],
      isPopular: formData.isPopular ?? false,
      isAvailable: formData.isAvailable ?? true,
    }

    if (validSizes.length > 0) {
      payload.sizes = validSizes
    }

    if (!editingProduct) {
      payload.createdAt = new Date().toISOString()
    }

    return payload
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return

    if (!formData.name?.trim() || !formData.category) {
      addNotification({ 
        type: 'error', 
        title: 'Validation Error', 
        message: 'Name and category are required' 
      })
      return
    }

    const validSizes = sizesList.filter((s) => s.size.trim() !== '' && s.price > 0)
    if (validSizes.length === 0 && (!formData.price || formData.price <= 0)) {
      addNotification({ 
        type: 'error', 
        title: 'Validation Error', 
        message: 'Please enter a valid price or add at least one size' 
      })
      return
    }

    setIsSubmitting(true)
    try {
      const payload = buildPayload()

      if (editingProduct) {
        await productService.update(editingProduct.id, payload)
        addNotification({ 
          type: 'success', 
          title: 'Product Updated', 
          message: `${payload.name} updated successfully!` 
        })
      } else {
        await productService.add(payload as any)
        addNotification({ 
          type: 'success', 
          title: 'Product Added', 
          message: `${payload.name} added successfully!` 
        })
      }
      closeModal()
    } catch (err: any) {
      console.error('Save error:', err)
      addNotification({ 
        type: 'error', 
        title: 'Save Failed', 
        message: err?.message || 'Could not save product. Check console for details.' 
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this product?')) return
    try {
      await productService.delete(id)
      addNotification({ type: 'success', title: 'Deleted', message: 'Product removed.' })
    } catch (err: any) {
      addNotification({ type: 'error', title: 'Error', message: err?.message || 'Delete failed.' })
    }
  }

  const isPizzaCategory = formData.category === 'Pizza'

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Products</h1>
          <p className="text-neutral-500 mt-1">Manage your menu items</p>
        </div>
        <button onClick={openAddModal} className="btn-primary flex items-center justify-center gap-2">
          <FiPlus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
        <input type="text" placeholder="Search products..." value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-700">Product</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-700">Category</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-700">Sub</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-700">Price</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-700">Available</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-neutral-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {product.image && <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />}
                      <div>
                        <p className="font-medium text-neutral-900">{product.name}</p>
                        <p className="text-xs text-neutral-500 line-clamp-1">{product.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-600">{product.category}</td>
                  <td className="px-4 py-3 text-sm text-neutral-600">{product.subCategory || '-'}</td>
                  <td className="px-4 py-3 text-sm text-neutral-600">
                    {product.sizes && product.sizes.length > 0
                      ? `${product.sizes[0].price} - ${product.sizes[product.sizes.length - 1].price}`
                      : product.price}
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
                      <button onClick={() => openEditModal(product)} className="p-2 text-neutral-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="p-2 text-neutral-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-neutral-500">No products found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-neutral-100">
              <h2 className="text-xl font-bold text-neutral-900">{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={closeModal} className="p-2 text-neutral-400 hover:text-neutral-600 rounded-lg transition-colors">
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Product Name *</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" required />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Description</label>
                  <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3} className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Category *</label>
                  <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value, subCategory: e.target.value === 'Pizza' ? 'Regular' : '' })}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" required>
                    <option value="">Select category</option>
                    {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>

                {isPizzaCategory && (
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Pizza Type *</label>
                    <select value={formData.subCategory} onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                      className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" required={isPizzaCategory}>
                      {PIZZA_SUBS.map((sub) => <option key={sub} value={sub}>{sub}</option>)}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Rating</label>
                  <input type="number" step="0.1" min="0" max="5" value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    <FiImage className="inline w-4 h-4 mr-1" />
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://res.cloudinary.com/.../image.jpg"
                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <p className="text-xs text-neutral-400 mt-1">
                    Paste Cloudinary/Imgur URL. Leave empty if no image.
                  </p>
                  {formData.image && (
                    <div className="mt-2">
                      <img src={formData.image} alt="Preview" className="w-20 h-20 rounded-lg object-cover border border-neutral-200" 
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                    </div>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-neutral-700">Sizes & Prices</label>
                    <button type="button" onClick={addSize} className="text-xs flex items-center gap-1 text-primary hover:text-primary-700 font-medium">
                      <FiPlus className="w-3 h-3" /> Add Size
                    </button>
                  </div>
                  {sizesList.length === 0 && <p className="text-xs text-neutral-400 mb-2">No sizes added. Product will use single price.</p>}
                  <div className="space-y-2">
                    {sizesList.map((sizeItem, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input type="text" placeholder="Size (e.g. Small)" value={sizeItem.size}
                          onChange={(e) => updateSize(index, 'size', e.target.value)}
                          className="flex-1 px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm" />
                        <input type="number" placeholder="Price" min="0" value={sizeItem.price || ''}
                          onChange={(e) => updateSize(index, 'price', e.target.value)}
                          className="w-28 px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm" />
                        <button type="button" onClick={() => removeSize(index)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {sizesList.length === 0 && (
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Price *</label>
                    <input type="number" min="0" step="1" value={formData.price || ''}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required={sizesList.length === 0} />
                  </div>
                )}

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Ingredients (comma separated)</label>
                  <input type="text" value={(formData.ingredients || []).join(', ')}
                    onChange={(e) => setFormData({ ...formData, ingredients: e.target.value.split(',').map((i) => i.trim()).filter(Boolean) })}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" />
                </div>

                <div className="sm:col-span-2 flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.isPopular || false}
                      onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                      className="w-4 h-4 text-primary rounded border-neutral-300 focus:ring-primary" />
                    <span className="text-sm text-neutral-700">Popular</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.isAvailable !== false}
                      onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                      className="w-4 h-4 text-primary rounded border-neutral-300 focus:ring-primary" />
                    <span className="text-sm text-neutral-700">Available</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors">Cancel</button>
                <button type="submit" className="btn-primary flex items-center gap-2" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : editingProduct ? 'Update Product' : 'Add Product'}
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