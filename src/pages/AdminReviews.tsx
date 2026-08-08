import { useState, useEffect } from 'react'
import { FiStar, FiTrash2 } from 'react-icons/fi'
import { collection, onSnapshot, query, orderBy, deleteDoc, doc, Timestamp } from 'firebase/firestore'
import { db } from '../firebase/firebase'
import { formatDateTime } from '../utils/formatters'
import type { Review } from '../types'

const AdminReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  // 🔥 Real-time Firestore subscription
  useEffect(() => {
    setLoading(true)
    const unsubscribe = onSnapshot(
      query(collection(db, 'reviews'), orderBy('date', 'desc')),
      (snapshot) => {
        const data = snapshot.docs.map((d) => {
          const docData = d.data()
          return {
            ...docData,
            id: d.id,
            date: docData.date instanceof Timestamp ? docData.date.toDate().toISOString() : docData.date,
          } as Review
        })
        setReviews(data)
        setLoading(false)
      },
      (err) => {
        console.error('Reviews error:', err)
        setLoading(false)
      }
    )
    return () => unsubscribe()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return
    try {
      await deleteDoc(doc(db, 'reviews', id))
    } catch (err) {
      console.error('Delete error:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading font-semibold text-lg">Reviews ({reviews.length})</h2>
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