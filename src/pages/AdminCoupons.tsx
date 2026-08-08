import { useState, useEffect, useCallback } from 'react'
import { FiPlus, FiEdit2, FiTrash2, FiCheck, FiX, FiTag, FiPercent, FiRefreshCw } from 'react-icons/fi'
import { collection, onSnapshot, query, orderBy, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore'
import { db } from '../firebase/firebase'
import { formatCurrency } from '../utils/formatters'
import { addNotification } from '../utils/notifications'

interface Coupon {
  id: string
  code: string
  discount: number
  type: 'percentage' | 'fixed'
  minOrder: number
  enabled: boolean
}

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null)
  const [formData, setFormData] = useState({
    code: '',
    discount: 0,
    type: 'percentage' as 'percentage' | 'fixed',
    minOrder: 0,
    enabled: true,
  })

  // 🔥 Fetch coupons from Firestore
  const fetchCoupons = useCallback(async () => {
    try {
      setLoading(true)
      const snapshot = await getDocs(query(collection(db, 'coupons'), orderBy('code')))
      const data = snapshot.docs.map((d) => ({ ...d.data(), id: d.id })) as Coupon[]
      console.log('✅ Coupons fetched:', data)
      setCoupons(data)
    } catch (err: any) {
      console.error('❌ Fetch error:', err)
      addNotification({ type: 'error', title: 'Error', message: err.message })
    } finally {
      setLoading(false)
    }
  }, [])

  // Real-time listener
  useEffect(() => {
    fetchCoupons()

    const unsubscribe = onSnapshot(
      query(collection(db, 'coupons'), orderBy('code')),
      (snapshot) => {
        const data = snapshot.docs.map((d) => ({ ...d.data(), id: d.id })) as Coupon[]
        console.log('🔄 Real-time update:', data.length, 'coupons')
        setCoupons(data)
        setLoading(false)
      },
      (err) => {
        console.error('❌ Real-time error:', err)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [fetchCoupons])

  const openAddModal = () => {
    setEditingCoupon(null)
    setFormData({ code: '', discount: 0, type: 'percentage', minOrder: 0, enabled: true })
    setShowModal(true)
  }

  const openEditModal = (coupon: Coupon) => {
    setEditingCoupon(coupon)
    setFormData({
      code: coupon.code,
      discount: coupon.discount,
      type: coupon.type,
      minOrder: coupon.minOrder,
      enabled: coupon.enabled,
    })
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!formData.code.trim()) {
      alert('Code is required!')
      return
    }

    setSaving(true)
    try {
      const payload = {
        code: formData.code.trim().toUpperCase(),
        discount: Number(formData.discount),
        type: formData.type,
        minOrder: Number(formData.minOrder),
        enabled: formData.enabled,
      }

      if (editingCoupon) {
        await updateDoc(doc(db, 'coupons', editingCoupon.id), payload)
        addNotification({ type: 'success', title: 'Updated', message: `Coupon ${payload.code} updated!` })
      } else {
        const docRef = await addDoc(collection(db, 'coupons'), {
          ...payload,
          createdAt: new Date().toISOString(),
        })
        console.log('✅ Saved with ID:', docRef.id)
        addNotification({ type: 'success', title: 'Added', message: `Coupon ${payload.code} added!` })
      }
      setShowModal(false)
    } catch (err: any) {
      console.error('❌ Save error:', err)
      alert('Failed to save: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return
    try {
      await deleteDoc(doc(db, 'coupons', id))
      addNotification({ type: 'success', title: 'Deleted', message: 'Coupon removed.' })
    } catch (err: any) {
      console.error('❌ Delete error:', err)
      alert('Delete failed: ' + err.message)
    }
  }

  const toggleEnabled = async (id: string, current: boolean) => {
    try {
      await updateDoc(doc(db, 'coupons', id), { enabled: !current })
    } catch (err: any) {
      alert('Toggle failed: ' + err.message)
    }
  }

  if (loading && coupons.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading font-semibold text-lg">Coupons ({coupons.length})</h2>
        <div className="flex gap-2">
          <button onClick={fetchCoupons} className="btn-outline text-sm py-2">
            <FiRefreshCw className="w-4 h-4" /> Refresh
          </button>
          <button onClick={openAddModal} className="btn-primary text-sm py-2">
            <FiPlus className="w-4 h-4" /> Add Coupon
          </button>
        </div>
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
                      onClick={() => toggleEnabled(coupon.id, coupon.enabled)}
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
              {coupons.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-neutral-500">
                    <FiTag className="w-8 h-8 mx-auto mb-2 text-neutral-300" />
                    No coupons yet. Add one!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => !saving && setShowModal(false)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="font-heading font-semibold text-lg mb-4">
              {editingCoupon ? 'Edit Coupon' : 'Add Coupon'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Code *</label>
                <input 
                  type="text" 
                  value={formData.code} 
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })} 
                  className="input" 
                  placeholder="SAVE10" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Discount *</label>
                  <input 
                    type="number" 
                    min="0"
                    value={formData.discount} 
                    onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) || 0 })} 
                    className="input" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Type *</label>
                  <select 
                    value={formData.type} 
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'percentage' | 'fixed' })} 
                    className="input"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed (Rs)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Min Order *</label>
                <input 
                  type="number" 
                  min="0"
                  value={formData.minOrder} 
                  onChange={(e) => setFormData({ ...formData, minOrder: parseFloat(e.target.value) || 0 })} 
                  className="input" 
                />
              </div>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={formData.enabled} 
                  onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })} 
                />
                <span>Active</span>
              </label>
              <div className="flex gap-2 pt-2">
                <button 
                  onClick={handleSave} 
                  disabled={saving}
                  className="btn-primary flex-1 disabled:opacity-60"
                >
                  {saving ? 'Saving...' : <><FiCheck className="w-4 h-4" /> Save</>}
                </button>
                <button 
                  onClick={() => setShowModal(false)} 
                  disabled={saving}
                  className="btn-outline flex-1 disabled:opacity-60"
                >
                  <FiX className="w-4 h-4" /> Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminCoupons