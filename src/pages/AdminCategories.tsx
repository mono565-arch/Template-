import { useState } from 'react'
import { FiPlus, FiEdit2, FiTrash2, FiCheck, FiX } from 'react-icons/fi'

interface CategoryItem {
  id: string
  name: string
  icon: string
  count: number
}

const AdminCategories = () => {
  const [categories, setCategories] = useState<CategoryItem[]>([
    { id: '1', name: 'Pizza', icon: '🍕', count: 4 },
    { id: '2', name: 'Burgers', icon: '🍔', count: 3 },
    { id: '3', name: 'Fries', icon: '🍟', count: 3 },
    { id: '4', name: 'Broast', icon: '🍗', count: 3 },
    { id: '5', name: 'Sandwich', icon: '🥪', count: 3 },
    { id: '6', name: 'Pasta', icon: '🍝', count: 3 },
    { id: '7', name: 'Drinks', icon: '🥤', count: 4 },
    { id: '8', name: 'Ice Cream', icon: '🍦', count: 3 },
    { id: '9', name: 'Desserts', icon: '🍰', count: 3 },
  ])

  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null)
  const [formData, setFormData] = useState({ name: '', icon: '' })

  const openAddModal = () => {
    setEditingCategory(null)
    setFormData({ name: '', icon: '' })
    setShowModal(true)
  }

  const openEditModal = (category: CategoryItem) => {
    setEditingCategory(category)
    setFormData({ name: category.name, icon: category.icon })
    setShowModal(true)
  }

  const handleSave = () => {
    if (!formData.name.trim()) return
    if (editingCategory) {
      setCategories(categories.map((c) => (c.id === editingCategory.id ? { ...c, ...formData } : c)))
    } else {
      setCategories([...categories, { id: 'new-' + Date.now(), ...formData, count: 0 }])
    }
    setShowModal(false)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure?')) setCategories(categories.filter((c) => c.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading font-semibold text-lg">Categories ({categories.length})</h2>
        <button onClick={openAddModal} className="btn-primary text-sm py-2">
          <FiPlus className="w-4 h-4" /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div key={category.id} className="bg-white rounded-xl p-5 border border-neutral-200 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{category.icon}</span>
              <div>
                <p className="font-semibold text-neutral-900">{category.name}</p>
                <p className="text-xs text-neutral-500">{category.count} products</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => openEditModal(category)} className="p-1.5 text-neutral-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                <FiEdit2 className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(category.id)} className="p-1.5 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                <FiTrash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="font-heading font-semibold text-lg mb-4">{editingCategory ? 'Edit Category' : 'Add Category'}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Name</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Icon (emoji)</label>
                <input type="text" value={formData.icon} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} className="input" placeholder="🍕" />
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={handleSave} className="btn-primary flex-1"><FiCheck className="w-4 h-4" />Save</button>
                <button onClick={() => setShowModal(false)} className="btn-outline flex-1"><FiX className="w-4 h-4" />Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminCategories
