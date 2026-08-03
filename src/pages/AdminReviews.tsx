import { useState, useEffect } from 'react'
import { FiStar, FiTrash2, FiSearch, FiMessageSquare } from 'react-icons/fi'
import { BsPinAngle, BsPinAngleFill } from 'react-icons/bs'
import { formatDateTime } from '../utils/formatters'
import type { Review } from '../types'

const AdminReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    const load = () => {
      const stored = JSON.parse(localStorage.getItem('pizza_saucy_reviews') || '[]')
      setReviews(stored.sort((a: Review, b: Review) => new Date(b.date).getTime() - new Date(a.date).getTime()))
    }
    load()
    const interval = setInterval(load, 3000)
    return () => clearInterval(interval)
  }, [])

  const togglePin = (id: string) => {
    const updated = reviews.map((r) => r.id === id ? { ...r, pinned: !r.pinned } : r)
    setReviews(updated)
    localStorage.setItem('pizza_saucy_reviews', JSON.stringify(updated))
  }

  const deleteReview = (id: string) => {
    const updated = reviews.filter((r) => r.id !== id)
    setReviews(updated)
    localStorage.setItem('pizza_saucy_reviews', JSON.stringify(updated))
  }

  const filtered = reviews.filter((r) =>
    search.trim() === '' ||
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.product.toLowerCase().includes(search.toLowerCase()) ||
    r.review.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="font-heading font-bold text-2xl text-neutral-900">Reviews</h1>
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reviews..."
            className="input pl-9 text-sm py-2"
          />
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((review) => (
          <div
            key={review.id}
            className={`card p-5 transition-all ${review.pinned ? 'border-l-4 border-l-primary bg-primary-50/30' : ''}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-semibold text-sm text-neutral-900">{review.name}</h3>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FiStar
                        key={star}
                        className={`w-3.5 h-3.5 ${star <= review.rating ? 'text-primary fill-primary' : 'text-neutral-300'}`}
                      />
                    ))}
                  </div>
                  {review.pinned && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary-100 px-2 py-0.5 rounded-full">
                      Pinned
                    </span>
                  )}
                </div>
                <p className="text-xs text-neutral-500 mb-1">
                  {review.email} · {review.product} · {formatDateTime(review.date)}
                </p>
                <p className="text-sm text-neutral-700 leading-relaxed">{review.review}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => togglePin(review.id)}
                  className={`p-2 rounded-lg transition-colors ${review.pinned ? 'text-primary bg-primary-100' : 'text-neutral-400 hover:bg-neutral-100'}`}
                  title={review.pinned ? 'Unpin from homepage' : 'Pin to homepage'}
                >
                  {review.pinned ? <BsPinAngleFill className="w-4 h-4" /> : <BsPinAngle className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => deleteReview(review.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <FiMessageSquare className="w-10 h-10 mx-auto mb-3 text-neutral-300" />
            <p className="text-neutral-500 text-sm">No reviews found</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminReviews
