import { FiAward, FiTarget, FiEye } from 'react-icons/fi'
import SectionTitle from '../components/SectionTitle'
import MapPlaceholder from '../components/MapPlaceholder'
import { whyChooseUs } from '../data'

const About = () => {
  return (
    <div className="space-y-16 lg:space-y-24">
      {/* Hero / Intro */}
      <section className="text-center space-y-6">
        <h1 className="section-title">About Pizza Saucy</h1>
        <p className="section-subtitle max-w-3xl mx-auto">
          We are passionate about creating the perfect pizza experience for every customer. From our kitchen to your table, quality is our promise.
        </p>
      </section>

      {/* Story */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div className="relative">
          <div className="aspect-square max-w-md mx-auto rounded-3xl overflow-hidden shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=600&fit=crop"
              alt="Our Kitchen"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary rounded-2xl flex items-center justify-center shadow-lg hidden lg:flex">
            <div className="text-center">
              <p className="font-heading font-bold text-3xl text-neutral-900">15+</p>
              <p className="text-xs text-neutral-700 font-medium">Years of<br/>Excellence</p>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-sm font-medium">
            <FiAward className="w-4 h-4" />
            Our Story
          </div>
          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-neutral-900">
            A Legacy of Flavor Since 2010
          </h2>
          <p className="text-neutral-600 leading-relaxed">
            Pizza Saucy started as a small family kitchen with a big dream: to serve the most authentic Italian pizza outside of Naples. What began as a humble pizzeria has grown into a beloved local institution, known for our commitment to quality and tradition.
          </p>
          <p className="text-neutral-600 leading-relaxed">
            Every pizza we make is a labor of love. Our dough is hand-tossed daily, our sauce is made from vine-ripened tomatoes, and our cheese is always fresh. We believe that great food brings people together, and that is exactly what we aim to do.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <div className="flex items-center gap-2 text-sm text-neutral-700">
              <div className="w-2 h-2 bg-primary rounded-full" />
              Handcrafted Daily
            </div>
            <div className="flex items-center gap-2 text-sm text-neutral-700">
              <div className="w-2 h-2 bg-primary rounded-full" />
              Fresh Ingredients
            </div>
            <div className="flex items-center gap-2 text-sm text-neutral-700">
              <div className="w-2 h-2 bg-primary rounded-full" />
              Family Recipe
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        <div className="card p-8 space-y-4 hover:shadow-lg transition-shadow">
          <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center">
            <FiTarget className="w-7 h-7 text-primary-600" />
          </div>
          <h3 className="font-heading font-semibold text-xl text-neutral-900">Our Mission</h3>
          <p className="text-neutral-600 leading-relaxed">
            To bring joy to every table with handcrafted pizzas made from the finest ingredients, baked with love and delivered with care. We strive to create memorable dining experiences that keep our customers coming back for more.
          </p>
        </div>
        <div className="card p-8 space-y-4 hover:shadow-lg transition-shadow">
          <div className="w-14 h-14 bg-secondary-100 rounded-2xl flex items-center justify-center">
            <FiEye className="w-7 h-7 text-secondary-700" />
          </div>
          <h3 className="font-heading font-semibold text-xl text-neutral-900">Our Vision</h3>
          <p className="text-neutral-600 leading-relaxed">
            To become the most loved pizza destination in every community we serve. We envision a world where everyone can enjoy authentic, high-quality pizza that is both delicious and affordable, delivered with exceptional service.
          </p>
        </div>
      </section>

      {/* Why Choose Us */}
      <section>
        <SectionTitle
          title="Why Choose Us"
          subtitle="We take pride in delivering the best food experience to our customers"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {whyChooseUs.map((item) => (
            <div
              key={item.id}
              className="group text-center p-6 sm:p-8 rounded-2xl bg-neutral-50 border border-neutral-100 hover:border-primary-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-primary-200 transition-colors">
                <span className="text-3xl">{item.icon}</span>
              </div>
              <h3 className="font-heading font-semibold text-lg text-neutral-900 mb-2">
                {item.title}
              </h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Map Placeholder */}
      <section>
        <SectionTitle
          title="Visit Our Restaurant"
          subtitle="Come see us and experience the Pizza Saucy difference"
        />
        <MapPlaceholder />
      </section>
    </div>
  )
}

export default About
