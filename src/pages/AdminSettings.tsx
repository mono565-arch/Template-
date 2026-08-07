import { useState, useEffect } from 'react'
import { useSettings } from '../hooks/useSettings'
import { FiSave, FiLoader, FiRotateCcw, FiCheckCircle } from 'react-icons/fi'

const AdminSettings = () => {
  const { settings, loading, saving, updateSettings } = useSettings()
  const [form, setForm] = useState(settings)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setForm(settings)
  }, [settings])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: name === 'deliveryFee' || name === 'minOrderAmount' || name === 'taxRate'
        ? Number(value)
        : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await updateSettings({
      name: form.name,
      phone: form.phone,
      email: form.email,
      address: form.address,
      mapUrl: form.mapUrl,        // ✅ ADDED
      deliveryFee: form.deliveryFee,
      minOrderAmount: form.minOrderAmount,
      taxRate: form.taxRate,
    })
    if (success) {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FiLoader className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">Restaurant Settings</h1>
        {saved && (
          <span className="flex items-center gap-2 text-green-600 text-sm font-medium">
            <FiCheckCircle /> Saved successfully!
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="card p-6 lg:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Restaurant Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="input w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="input w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="input w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Delivery Fee (PKR)
            </label>
            <input
              type="number"
              name="deliveryFee"
              value={form.deliveryFee}
              onChange={handleChange}
              className="input w-full"
              min={0}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Minimum Order (PKR)
            </label>
            <input
              type="number"
              name="minOrderAmount"
              value={form.minOrderAmount}
              onChange={handleChange}
              className="input w-full"
              min={0}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Tax Rate (%)
            </label>
            <input
              type="number"
              name="taxRate"
              value={form.taxRate}
              onChange={handleChange}
              className="input w-full"
              min={0}
              step={0.01}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">
            Address
          </label>
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            rows={3}
            className="input w-full resize-none"
            required
          />
        </div>

        {/* ✅ ADDED: Google Maps URL Field */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">
            Google Maps URL
          </label>
          <input
            type="url"
            name="mapUrl"
            value={form.mapUrl || ''}
            onChange={handleChange}
            className="input w-full"
            placeholder="https://maps.google.com/?q=..."
          />
          <p className="text-xs text-neutral-400 mt-1">
            Google Maps se location share karke link paste karo
          </p>
        </div>

        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary flex items-center gap-2 disabled:opacity-60"
          >
            {saving ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiSave className="w-4 h-4" />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => setForm(settings)}
            className="px-4 py-2.5 rounded-xl text-sm font-medium text-neutral-600 border border-neutral-200 hover:bg-neutral-50 transition-colors flex items-center gap-2"
          >
            <FiRotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </form>
    </div>
  )
}

export default AdminSettings