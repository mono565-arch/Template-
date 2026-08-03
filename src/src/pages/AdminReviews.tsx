import { useState, useEffect } from 'react'
import { FiStar, FiTrash2, FiEye, FiEyeOff, FiUser } from 'react-icons/fi'

interface ReviewItem {
  id: string
  name: string
  rating: number
  review: string
  date: string
  visible: boolean
}

const AdminReviews = () => {
  const [reviews, setReviews] = useState<ReviewItem[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('pizzaSaucyReviews')
    if (stored) {
      setReviews(JSON.parse(stored))
    } else {
      // Default reviews
      const defaultReviews: ReviewItem[] = [
        { id: '1', name: 'Sarah Mitchell', rating: 5, review: 'The best pizza I have ever had! Fresh and delicious.', date: '2024-07-15', visible: true },
        { id: '2', name: 'Michael Chen', rating: 5, review: 'Authentic and consistently amazing quality.', date: '2024-07-18', visible: true },
        { id: '3', name: 'Emily Rodriguez', rating: 4, review: 'Great value for money. Family pack is perfect!', date: '2024-07-20', visible: true },
      ]
      setReviews(defaultReviews)
      localStorage.setItem('pizzaSaucyReviews', JSON.stringify(defaultReviews))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('pizzaSaucyReviews', JSON.stringify(reviews))
  }, [reviews])

  const toggleVisible = (id: string) => {
    setReviews(reviews.map((r) => (r.id === id ? { ...r, visible: !r.visible } : r)))
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure?')) setReviews(reviews.filter((r) => r.id !== id))
  }

  return (
    <div className="space-y-6">
      <h2 className="font-heading font-semibold text-lg text-neutral-900">Reviews ({reviews.length})</h2>

      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Rating</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase hidden sm:table-cell">Review</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Status</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-neutral-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {reviews.map((review) => (
                <tr key={review.id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <FiUser className="w-4 h-4 text-primary-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-900">{review.name}</p>
                        <p className="text-xs text-neutral-500">{review.date}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <FiStar key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'text-primary fill-primary' : 'text-neutral-300'}`} />
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-600 hidden sm:table-cell max-w-xs truncate">{review.review}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${review.visible ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-600'}`}>
                      {review.visible ? 'Visible' : 'Hidden'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => toggleVisible(review.id)} className="p-1.5 text-neutral-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                        {review.visible ? <FiEye className="w-4 h-4" /> : <FiEyeOff className="w-4 h-4" />}
                      </button>
                      <button onClick={() => handleDelete(review.id)} className="p-1.5 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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
    </div>
  )
}

export default AdminReviews