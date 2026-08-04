import { useState } from 'react'
import { FiPhone, FiMail, FiMapPin, FiClock, FiSend, FiCheckCircle, FiStar } from 'react-icons/fi'
import { LS_KEYS, getItem, setItem } from '../utils/localStorage'
import { addNotification } from '../utils/notifications'
import type { Review } from '../types'

const Contact = () => {
  const [submitted, setSubmitted] = useState(false)
  const [reviewSubmitted, setReviewSubmitted] = useState(false)
  const [activeTab, setActiveTab] = useState<'contact' | 'review'>('contact')

  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })

  const [reviewForm, setReviewForm] = useState({
    name: '',
    email: '',
    message: '',
    rating: 5,
    product: '',
  })

  const [reviewErrors, setReviewErrors] = useState<Record<string, string>>({})

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newMessage = {
      id: 'msg-' + Date.now(),
      name: contactForm.name || 'Anonymous',
      email: contactForm.email || '',
      message: contactForm.message,
      date: new Date().toISOString(),
      read: false,
    }
    const existing = getItem<typeof newMessage[]>(LS_KEYS.MESSAGES, [])
    setItem(LS_KEYS.MESSAGES, [newMessage, ...existing])

    addNotification({
      type: 'message',
      title: 'New Message',
      message: `From ${newMessage.name}`,
      link: '/admin/messages',
    })

    setSubmitted(true)
    setContactForm({ name: '', email: '', phone: '', message: '' })
    setTimeout(() => setSubmitted(false), 3000)
  }

  const validateReview = () => {
    const errors: Record<string, string> = {}
    if (!reviewForm.name.trim()) errors.name = 'Name is required'
    if (!reviewForm.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reviewForm.email)) {
      errors.email = 'Enter a valid email address'
    }
    if (!reviewForm.message.trim()) errors.message = 'Message is required'
    if (!reviewForm.product) errors.product = 'Please select a product'
    setReviewErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateReview()) {
      const newReview: Review = {
        id: 'rev-' + Date.now(),
        name: reviewForm.name,
        email: reviewForm.email,
        review: reviewForm.message,
        rating: reviewForm.rating,
        product: reviewForm.product,
        date: new Date().toISOString(),
      }
      const existing = getItem<Review[]>(LS_KEYS.REVIEWS, [])
      setItem(LS_KEYS.REVIEWS, [newReview, ...existing])

      addNotification({
        type: 'review',
        title: 'New Review',
        message: `${reviewForm.rating} stars from ${reviewForm.name}`,
        link: '/admin/reviews',
      })

      setReviewSubmitted(true)
      setReviewForm({ name: '', email: '', message: '', rating: 5, product: '' })
      setTimeout(() => setReviewSubmitted(false), 4000)
    }
  }

  const productOptions = (() => {
    const stored = getItem<{ name: string }[]>(LS_KEYS.PRODUCTS, [])
    return stored.map((p) => p.name)
  })()

  return (
    <div className="space-y-16 lg:space-y-24">
      {/* Header */}
      <section className="text-center space-y-4 pt-4">
        <h1 className="section-title">Contact & Reviews</h1>
        <p className="section-subtitle max-w-2xl mx-auto">
          Have a question or want to share your experience? We would love to hear from you.
        </p>
      </section>

      {/* Tabs */}
      <div className="flex justify-center gap-2">
        <button
          onClick={() => setActiveTab('contact')}
          className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'contact'
              ? 'bg-primary text-neutral-900 shadow-md'
              : 'bg-white text-neutral-600 border border-neutral-200 hover:border-primary-300'
          }`}
        >
          Contact Us
        </button>
        <button
          onClick={() => setActiveTab('review')}
          className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'review'
              ? 'bg-primary text-neutral-900 shadow-md'
              : 'bg-white text-neutral-600 border border-neutral-200 hover:border-primary-300'
          }`}
        >
          Write a Review
        </button>
      </div>

      {activeTab === 'contact' ? (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Contact Info - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6 lg:p-8 space-y-6">
              <h2 className="font-heading font-semibold text-xl text-neutral-900">Get in Touch</h2>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 bg-primary-100 rounded-xl flex items-center justify-center shrink-0">
                    <FiMapPin className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-neutral-900 text-sm">Address</h3>
                    <p className="text-neutral-600 text-sm mt-0.5">123 Pizza Lane, Food District<br/>Lahore, Punjab 54000, Pakistan</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 bg-primary-100 rounded-xl flex items-center justify-center shrink-0">
                    <FiPhone className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-neutral-900 text-sm">Phone</h3>
                    <p className="text-neutral-600 text-sm mt-0.5">+92 (42) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 bg-primary-100 rounded-xl flex items-center justify-center shrink-0">
                    <FiMail className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-neutral-900 text-sm">Email</h3>
                    <p className="text-neutral-600 text-sm mt-0.5">hello@pizzasaucy.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 bg-primary-100 rounded-xl flex items-center justify-center shrink-0">
                    <FiClock className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-neutral-900 text-sm">Business Hours</h3>
                    <div className="text-neutral-600 text-sm mt-0.5 space-y-0.5">
                      <p>Mon - Thu: 10:00 AM - 10:00 PM</p>
                      <p>Fri - Sat: 10:00 AM - 11:00 PM</p>
                      <p>Sunday: 11:00 AM - 9:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form - Right Side */}
          <div className="lg:col-span-3">
            <div className="card p-6 lg:p-8 space-y-6">
              <h2 className="font-heading font-semibold text-xl text-neutral-900">Send a Message</h2>
              {submitted ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <FiCheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-heading font-semibold text-lg text-neutral-900">Message Sent!</h3>
                  <p className="text-neutral-600 text-sm">We will get back to you as soon as possible.</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="contact-name" className="block text-sm font-medium text-neutral-700 mb-1.5">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="contact-name"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        className="input"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-email" className="block text-sm font-medium text-neutral-700 mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="contact-email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        className="input"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="contact-phone" className="block text-sm font-medium text-neutral-700 mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="contact-phone"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      className="input"
                      placeholder="+92 300 1234567"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-message" className="block text-sm font-medium text-neutral-700 mb-1.5">
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      rows={5}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      className="input resize-none"
                      placeholder="Tell us what's on your mind..."
                      required
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="btn-primary w-full"
                  >
                    <FiSend className="w-4 h-4" />
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Review Form */
        <div className="max-w-2xl mx-auto">
          <div className="card p-6 lg:p-8 space-y-6">
            <h2 className="font-heading font-semibold text-xl text-neutral-900">Write a Review</h2>
            {reviewSubmitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <FiCheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-heading font-semibold text-lg text-neutral-900">Thank you for your review!</h3>
                <p className="text-neutral-600 text-sm">Your feedback helps us improve and serve you better.</p>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="review-name" className="block text-sm font-medium text-neutral-700 mb-1.5">
                      Name
                    </label>
                    <input
                      type="text"
                      id="review-name"
                      value={reviewForm.name}
                      onChange={(e) => {
                        setReviewForm({ ...reviewForm, name: e.target.value })
                        if (reviewErrors.name) setReviewErrors({ ...reviewErrors, name: '' })
                      }}
                      className={`input ${reviewErrors.name ? 'border-red-400 focus:ring-red-400' : ''}`}
                      placeholder="Your name"
                    />
                    {reviewErrors.name && <p className="text-red-500 text-xs mt-1">{reviewErrors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="review-email" className="block text-sm font-medium text-neutral-700 mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      id="review-email"
                      value={reviewForm.email}
                      onChange={(e) => {
                        setReviewForm({ ...reviewForm, email: e.target.value })
                        if (reviewErrors.email) setReviewErrors({ ...reviewErrors, email: '' })
                      }}
                      className={`input ${reviewErrors.email ? 'border-red-400 focus:ring-red-400' : ''}`}
                      placeholder="your@email.com"
                    />
                    {reviewErrors.email && <p className="text-red-500 text-xs mt-1">{reviewErrors.email}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="review-product" className="block text-sm font-medium text-neutral-700 mb-1.5">
                    Product
                  </label>
                  <select
                    id="review-product"
                    value={reviewForm.product}
                    onChange={(e) => {
                      setReviewForm({ ...reviewForm, product: e.target.value })
                      if (reviewErrors.product) setReviewErrors({ ...reviewErrors, product: '' })
                    }}
                    className={`input ${reviewErrors.product ? 'border-red-400 focus:ring-red-400' : ''}`}
                  >
                    <option value="">Select a product...</option>
                    {productOptions.map((p: string) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                  {reviewErrors.product && <p className="text-red-500 text-xs mt-1">{reviewErrors.product}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Rating
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                        className="p-1 transition-transform hover:scale-110"
                      >
                        <FiStar
                          className={`w-7 h-7 ${
                            star <= reviewForm.rating
                              ? 'text-primary fill-primary'
                              : 'text-neutral-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="review-message" className="block text-sm font-medium text-neutral-700 mb-1.5">
                    Your Review
                  </label>
                  <textarea
                    id="review-message"
                    rows={4}
                    value={reviewForm.message}
                    onChange={(e) => {
                      setReviewForm({ ...reviewForm, message: e.target.value })
                      if (reviewErrors.message) setReviewErrors({ ...reviewErrors, message: '' })
                    }}
                    className={`input resize-none ${reviewErrors.message ? 'border-red-400 focus:ring-red-400' : ''}`}
                    placeholder="Share your experience..."
                  ></textarea>
                  {reviewErrors.message && <p className="text-red-500 text-xs mt-1">{reviewErrors.message}</p>}
                </div>

                <button type="submit" className="btn-primary w-full">
                  <FiSend className="w-4 h-4" />
                  Submit Review
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Contact
