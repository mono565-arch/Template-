import { useState } from 'react'
import { FiPhone, FiMail, FiMapPin, FiClock, FiSend, FiCheckCircle } from 'react-icons/fi'
import SectionTitle from '../components/SectionTitle'

const Contact = () => {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div className="space-y-16 lg:space-y-24">
      {/* Header */}
      <section className="text-center space-y-4 pt-4">
        <h1 className="section-title">Contact Us</h1>
        <p className="section-subtitle max-w-2xl mx-auto">
          Have a question, feedback, or just want to say hello? We would love to hear from you.
        </p>
      </section>

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
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1.5">
                    Full Name
                  </label>
                  <input type="text" id="name" className="input" placeholder="John Doe" required />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1.5">
                    Email Address
                  </label>
                  <input type="email" id="email" className="input" placeholder="john@example.com" required />
                </div>
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Phone Number
                </label>
                <input type="tel" id="phone" className="input" placeholder="+92 300 1234567" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  className="input resize-none"
                  placeholder="Tell us what's on your mind..."
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="btn-primary w-full"
              >
                {submitted ? (
                  <>
                    <FiCheckCircle className="w-4 h-4" />
                    Message Sent!
                  </>
                ) : (
                  <>
                    <FiSend className="w-4 h-4" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Lahore Map Placeholder */}
      <section>
        <SectionTitle
          title="Find Us in Lahore"
          subtitle="We are located in the heart of Lahore, Pakistan"
        />
        <div className="w-full rounded-2xl overflow-hidden border border-neutral-200 shadow-sm">
          <div className="h-80 sm:h-96 bg-neutral-100 flex flex-col items-center justify-center gap-4 relative overflow-hidden">
            {/* Decorative map-like pattern */}
            <div className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `
                  linear-gradient(#d1d5db 1px, transparent 1px),
                  linear-gradient(90deg, #d1d5db 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px'
              }}
            />
            {/* Decorative roads */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-1/2 left-0 right-0 h-3 bg-neutral-400 -translate-y-1/2" />
              <div className="absolute top-0 bottom-0 left-1/3 w-3 bg-neutral-400 -translate-x-1/2" />
              <div className="absolute top-0 bottom-0 right-1/3 w-3 bg-neutral-400 translate-x-1/2" />
            </div>
            <div className="relative z-10 flex flex-col items-center gap-3 text-center px-4">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
                <FiMapPin className="w-8 h-8 text-neutral-900" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-lg text-neutral-800">Pizza Saucy Lahore</h3>
                <p className="text-neutral-500 text-sm mt-1">123 Pizza Lane, Gulberg III, Lahore</p>
                <p className="text-neutral-400 text-xs mt-0.5">Google Maps will be connected here soon</p>
              </div>
              <div className="flex items-center gap-2 mt-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg">
                <span className="text-xs text-neutral-600">📍 31.5204° N, 74.3587° E</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact
