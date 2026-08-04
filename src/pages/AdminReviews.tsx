import { useState, useEffect } from 'react'
import { FiStar, FiTrash2, FiRefreshCw } from 'react-icons/fi'
import { formatDateTime } from '../utils/formatters'
import { LS_KEYS, getItem, setItem } from '../utils/localStorage'
import type { Review } from '../types'

const AdminReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([])

  const loadReviews = () => {
    const stored = getItem<Review[]>(LS_KEYS.REVIEWS, [])
    setReviews(stored)
  }

  useEffect(() => {
    loadReviews()
    const interval = setInterval(loadReviews, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleDelete = (id: string) => {
    if (confirm('Are you sure?')) {
      const updated = reviews.filter((r) => r.id !== id)
      setReviews(updated)
      setItem(LS_KEYS.REVIEWS, updated)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading font-semibold text-lg">Reviews ({reviews.length})</h2>
        <button onClick={loadReviews} className="btn-outline text-sm py-2">
          <FiRefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Product</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Rating</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Review</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Date</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-neutral-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {reviews.map((review) => (
                <tr key={review.id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3 text-sm font-medium text-neutral-900">{review.name}</td>
                  <td className="px-4 py-3 text-sm text-neutral-600">{review.product || '-'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <FiStar
                          key={i}
                          className={`w-4 h-4 ${i < review.rating ? 'text-primary fill-primary' : 'text-neutral-300'}`}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-600 max-w-xs truncate">{review.review}</td>
                  <td className="px-4 py-3 text-sm text-neutral-500 whitespace-nowrap">{review.date ? formatDateTime(review.date) : 'N/A'}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleDelete(review.id)} className="p-1.5 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {reviews.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-neutral-500">
                    <FiStar className="w-8 h-8 mx-auto mb-2 text-neutral-300" />
                    No reviews yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminReviews
