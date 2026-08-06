import { useState, useEffect } from 'react'
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiX,
  FiCheck,
  FiTag,
} from 'react-icons/fi'
import { getItem, setItem, LS_KEYS } from '../utils/localStorage'
import { addNotification } from '../utils/notifications'
import type { Deal } from '../data'

const AdminDeals = () => {
  const [deals, setDeals] = useState<Deal[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null)

  const [formData, setFormData] = useState<Partial<Deal>>({
    name: '',
    description: '',
    price: 0,
    image: '',
    items: [],
  })

  const [itemsText, setItemsText] = useState('')

  useEffect(() => {
    loadDeals()
  }, [])

  const loadDeals = () => {
    const stored = getItem<Deal[]>(LS_KEYS.DEALS, [])
    setDeals(stored)
  }

  const filteredDeals = deals.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      image: '',
      items: [],
    })
    setItemsText('')
    setEditingDeal(null)
  }

  const openAddModal = () => {
    resetForm()
    setIsModalOpen(true)
  }

  const openEditModal = (deal: Deal) => {
    setEditingDeal(deal)
    setFormData({ ...deal })
    setItemsText(deal.items.join('\n'))
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    resetForm()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.description) {
      addNotification({
        type: 'product_added',
        title: 'Validation Error',
        message: 'Name and description are required',
      })
      return
    }

    const dealData: Deal = {
      id: editingDeal ? editingDeal.id : `deal_${Date.now()}`,
      name: formData.name || '',
      description: formData.description || '',
      price: formData.price || 0,
      image: formData.image || '',
      items: itemsText.split('\n').map(i => i.trim()).filter(Boolean),
    }

    let updated: Deal[]
    if (editingDeal) {
      updated = deals.map((d) =>
        d.id === editingDeal.id ? dealData : d
      )
      addNotification({
        type: 'product_updated',
        title: 'Deal Updated',
        message: `${dealData.name} has been updated successfully`,
      })
    } else {
      updated = [...deals, dealData]
      addNotification({
        type: 'product_added',
        title: 'Deal Added',
        message: `${dealData.name} has been added successfully`,
      })
    }

    setItem(LS_KEYS.DEALS, updated)
    setDeals(updated)
    closeModal()
  }

  const handleDelete = (id: string) => {
    if (!window.confirm('Are you sure you want to delete this deal?'))
      return
    const deal = deals.find((d) => d.id === id)
    const updated = deals.filter((d) => d.id !== id)
    setItem(LS_KEYS.DEALS, updated)
    setDeals(updated)
    addNotification({
      type: 'product_deleted',
      title: 'Deal Deleted',
      message: deal ? `${deal.name} has been deleted` : 'Deal has been deleted',
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Deals</h1>
          <p className="text-neutral-500 mt-1">Manage combo deals</p>
        </div>
        <button
          onClick={openAddModal}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <FiPlus className="w-4 h-4" />
          Add Deal
        </button>
      </div>

      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
        <input
          type="text"
          placeholder="Search deals..."
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
                  Deal
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-700">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-700">
                  Items
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-neutral-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredDeals.map((deal) => (
                <tr key={deal.id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {deal.image && (
                        <img
                          src={deal.image}
                          alt={deal.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                      )}
                      <div>
                        <p className="font-medium text-neutral-900">
                          {deal.name}
                        </p>
                        <p className="text-xs text-neutral-500 line-clamp-1">
                          {deal.description}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-600">
                    Rs {deal.price}
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-600">
                    {deal.items.length} items
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(deal)}
                        className="p-2 text-neutral-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(deal.id)}
                        className="p-2 text-neutral-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredDeals.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-8 text-center text-neutral-500"
                  >
                    No deals found
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
                {editingDeal ? 'Edit Deal' : 'Add Deal'}
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
                    Deal Name *
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
                    Description *
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Price (Rs) *
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
                    required
                  />
                </div>

                <div>
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

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Items (one per line)
                  </label>
                  <textarea
                    value={itemsText}
                    onChange={(e) => setItemsText(e.target.value)}
                    rows={4}
                    placeholder="2 Small Pizza&#10;1 Half Liter Drink"
                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
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
                  {editingDeal ? 'Update Deal' : 'Add Deal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDeals