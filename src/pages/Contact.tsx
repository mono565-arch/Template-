import { FiPhone, FiMail, FiMapPin, FiClock } from 'react-icons/fi'

const Contact = () => {
  return (
    <div className="space-y-12 lg:space-y-16">
      <div className="text-center space-y-4">
        <h1 className="section-title">Contact Us</h1>
        <p className="section-subtitle max-w-2xl mx-auto">
          Have a question or feedback? We would love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Contact Info */}
        <div className="space-y-6">
          <div className="card p-6 space-y-6">
            <h2 className="font-heading font-semibold text-xl">Get in Touch</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center shrink-0">
                  <FiMapPin className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900">Address</h3>
                  <p className="text-sm text-neutral-600">123 Pizza Lane, Food District, NY 10001</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center shrink-0">
                  <FiPhone className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900">Phone</h3>
                  <p className="text-sm text-neutral-600">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center shrink-0">
                  <FiMail className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900">Email</h3>
                  <p className="text-sm text-neutral-600">hello@pizzasaucy.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center shrink-0">
                  <FiClock className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900">Hours</h3>
                  <p className="text-sm text-neutral-600">Mon - Sun: 10:00 AM - 11:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form Placeholder */}
        <div className="card p-6 lg:p-8 space-y-6">
          <h2 className="font-heading font-semibold text-xl">Send a Message</h2>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">
                Name
              </label>
              <input type="text" id="name" className="input" placeholder="Your name" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                Email
              </label>
              <input type="email" id="email" className="input" placeholder="your@email.com" />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-1">
                Message
              </label>
              <textarea id="message" rows={4} className="input resize-none" placeholder="Your message..."></textarea>
            </div>
            <button type="submit" className="btn-primary w-full">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Contact
