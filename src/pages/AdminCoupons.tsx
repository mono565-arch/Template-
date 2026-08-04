import { useState, useEffect } from 'react'
import { FiPlus, FiEdit2, FiTrash2, FiCheck, FiX, FiTag, FiPercent } from 'react-icons/fi'
import { LS_KEYS, getItem, setItem } from '../utils/localStorage'
import { formatCurrency } from '../utils/formatters'

interface Coupon {
  id: string
  code: string
  discount: number
  type: 'percentage' | 'fixed'
  minOrder: number
  enabled: boolean
}

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const stored = getItem<Coupon[]>(LS_KEYS.COUPONS, [])
    if (stored.length === 0) {
      const defaults: Coupon[] = [
        { id: '1', code: 'SAVE10', discount: 10, type: 'percentage', minOrder: 1000, enabled: true },
        { id: '2', code: 'WELCOME5', discount: 5, type: 'fixed', minOrder: 500, enabled: true },
      ]
      setItem(LS_KEYS.COUPONS, defaults)
      return defaults
    }
    return stored
  })

  const [showModal, setShowModal] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null)
  const [formData, setFormData] = useState({
    code: '',
    discount: 0,
    type: 'percentage' as 'percentage' | 'fixed',
    minOrder: 0,
    enabled: true,
  })

  useEffect(() => {
    setItem(LS_KEYS.COUPONS, coupons)
  }, [coupons])

  const openAddModal = () => {
    setEditingCoupon(null)
    setFormData({ code: '', discount: 0, type: 'percentage', minOrder: 0, enabled: true })
    setShowModal(true)
  }

  const openEditModal = (coupon: Coupon) => {
    setEditingCoupon(coupon)
    setFormData({ code: coupon.code, discount: coupon.discount, type: coupon.type, minOrder: coupon.minOrder, enabled: coupon.enabled })
    setShowModal(true)
  }

  const handleSave = () => {
    if (!formData.code.trim()) return
    if (editingCoupon) {
      const updated = coupons.map((c) => (c.id === editingCoupon.id ? { ...c, ...formData } : c))
      setCoupons(updated)
    } else {
      const newCoupon: Coupon = { id: 'coup-' + Date.now(), ...formData }
      setCoupons([...coupons, newCoupon])
    }
    setShowModal(false)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure?')) {
      setCoupons(coupons.filter((c) => c.id !== id))
    }
  }

  const toggleEnabled = (id: string) => {
    const updated = coupons.map((c) => (c.id === id ? { ...c, enabled: !c.enabled } : c))
    setCoupons(updated)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading font-semibold text-lg">Coupons ({coupons.length})</h2>
        <button onClick={openAddModal} className="btn-primary text-sm py-2">
          <FiPlus className="w-4 h-4" /> Add Coupon
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Code</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Discount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Min Order</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Status</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-neutral-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {coupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <FiTag className="w-4 h-4 text-primary-600" />
                      <span className="text-sm font-semibold text-neutral-900">{coupon.code}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-600">
                    {coupon.type === 'percentage' ? (
                      <span className="flex items-center gap-1"><FiPercent className="w-3.5 h-3.5" />{coupon.discount}%</span>
                    ) : (
                      formatCurrency(coupon.discount)
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-600">{formatCurrency(coupon.minOrder)}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleEnabled(coupon.id)}
                      className={`px-2.5 py-1 text-xs font-medium rounded-full transition-colors ${
                        coupon.enabled ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {coupon.enabled ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEditModal(coupon)} className="p-1.5 text-neutral-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(coupon.id)} className="p-1.5 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="font-heading font-semibold text-lg mb-4">{editingCoupon ? 'Edit Coupon' : 'Add Coupon'}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Code</label>
                <input type="text" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} className="input" placeholder="SAVE10" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Discount</label>
                  <input type="number" value={formData.discount} onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) })} className="input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Type</label>
                  <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as 'percentage' | 'fixed' })} className="input">
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed (Rs)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Min Order</label>
                <input type="number" value={formData.minOrder} onChange={(e) => setFormData({ ...formData, minOrder: parseFloat(e.target.value) })} className="input" />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={formData.enabled} onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })} />
                Active
              </label>
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

export default AdminCoupons
