import { useState } from 'react'
import { FiSend, FiCheckCircle } from 'react-icons/fi'
import SectionTitle from './SectionTitle'

const Newsletter = () => {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      setSubmitted(true)
      setEmail('')
      setTimeout(() => setSubmitted(false), 3000)
    }
  }

  return (
    <div className="relative overflow-hidden rounded-3xl bg-neutral-900">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-72 h-72 bg-primary rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-secondary rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </div>
      <div className="relative px-6 py-14 sm:py-20 lg:py-24">
        <SectionTitle
          title="Stay Updated"
          subtitle="Subscribe to our newsletter for exclusive deals, new menu items, and special offers delivered straight to your inbox."
          light
        />
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-5 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                required
              />
            </div>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-neutral-900 font-semibold text-sm rounded-xl hover:bg-primary-600 transition-colors shrink-0"
            >
              {submitted ? (
                <>
                  <FiCheckCircle className="w-4 h-4" />
                  Subscribed!
                </>
              ) : (
                <>
                  <FiSend className="w-4 h-4" />
                  Subscribe
                </>
              )}
            </button>
          </div>
          <p className="text-white/40 text-xs text-center mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </form>
      </div>
    </div>
  )
}

export default Newsletter
