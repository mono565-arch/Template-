import { useState } from 'react'
import { FiStar, FiSend, FiCheckCircle } from 'react-icons/fi'

interface ReviewFormProps {
  onSubmit?: () => void
}

const ReviewForm = ({ onSubmit }: ReviewFormProps) => {
  const [name, setName] = useState('')
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [review, setReview] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name.trim()) { setError('Please enter your name'); return }
    if (rating === 0) { setError('Please select a rating'); return }
    if (!review.trim() || review.trim().length < 10) { setError('Review must be at least 10 characters'); return }

    const newReview = {
      id: 'REV-' + Date.now().toString(36).toUpperCase(),
      name: name.trim(),
      rating,
      review: review.trim(),
      date: new Date().toISOString().split('T')[0],
      visible: true,
    }

    const stored = localStorage.getItem('pizzaSaucyReviews')
    const reviews = stored ? JSON.parse(stored) : []
    reviews.unshift(newReview)
    localStorage.setItem('pizzaSaucyReviews', JSON.stringify(reviews))

    setName('')
    setRating(0)
    setReview('')
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 4000)
    onSubmit?.()
  }

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 sm:p-8">
      <h3 className="font-heading font-semibold text-lg text-neutral-900 mb-4">Write a Review</h3>
      
      {submitted && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm mb-4">
          <FiCheckCircle className="w-4 h-4" />
          Thank you for your review! It will appear after approval.
        </div>
      )}
      
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">Your Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input w-full" placeholder="John Doe" />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">Rating</label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 transition-colors"
              >
                <FiStar className={`w-6 h-6 ${star <= (hoverRating || rating) ? 'text-primary fill-primary' : 'text-neutral-300'}`} />
              </button>
            ))}
            <span className="ml-2 text-sm text-neutral-500">{rating > 0 ? `${rating}/5` : 'Select rating'}</span>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">Your Review</label>
          <textarea value={review} onChange={(e) => setReview(e.target.value)} rows={4} className="input w-full resize-none" placeholder="Share your experience..." />
        </div>
        
        <button type="submit" className="btn-primary w-full">
          <FiSend className="w-4 h-4" />
          Submit Review
        </button>
      </form>
    </div>
  )
}

export default ReviewForm