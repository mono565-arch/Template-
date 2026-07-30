import { FiAward, FiUsers, FiHeart } from 'react-icons/fi'

const About = () => {
  return (
    <div className="space-y-12 lg:space-y-16">
      <div className="text-center space-y-4">
        <h1 className="section-title">About Pizza Saucy</h1>
        <p className="section-subtitle max-w-2xl mx-auto">
          We are passionate about creating the perfect pizza experience for every customer.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="card p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto">
            <FiAward className="w-8 h-8 text-primary-600" />
          </div>
          <h3 className="font-heading font-semibold text-xl">Our Story</h3>
          <p className="text-neutral-600 text-sm leading-relaxed">
            Founded in 2010, Pizza Saucy started as a small family kitchen with a big dream: to serve the most authentic Italian pizza outside of Naples.
          </p>
        </div>
        <div className="card p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-secondary-100 rounded-2xl flex items-center justify-center mx-auto">
            <FiUsers className="w-8 h-8 text-secondary-700" />
          </div>
          <h3 className="font-heading font-semibold text-xl">Our Team</h3>
          <p className="text-neutral-600 text-sm leading-relaxed">
            Our team of expert pizzaiolos brings decades of combined experience, trained in the traditional art of Neapolitan pizza making.
          </p>
        </div>
        <div className="card p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto">
            <FiHeart className="w-8 h-8 text-primary-600" />
          </div>
          <h3 className="font-heading font-semibold text-xl">Our Mission</h3>
          <p className="text-neutral-600 text-sm leading-relaxed">
            To bring joy to every table with handcrafted pizzas made from the finest ingredients, baked with love and delivered with care.
          </p>
        </div>
      </div>
    </div>
  )
}

export default About
