import { FiMapPin } from 'react-icons/fi'

interface MapPlaceholderProps {
  title?: string
  description?: string
}

const MapPlaceholder = ({ title = "Find Us", description = "Google Maps will be connected here soon." }: MapPlaceholderProps) => {
  return (
    <div className="w-full rounded-2xl overflow-hidden border border-neutral-200 shadow-sm">
      <div className="h-72 sm:h-80 lg:h-96 bg-neutral-100 flex flex-col items-center justify-center gap-4 relative overflow-hidden">
        {/* Decorative grid pattern */}
        <div className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'radial-gradient(circle, #d1d5db 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />
        <div className="relative z-10 flex flex-col items-center gap-3">
          <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center">
            <FiMapPin className="w-8 h-8 text-primary-600" />
          </div>
          <div className="text-center">
            <h3 className="font-heading font-semibold text-lg text-neutral-800">{title}</h3>
            <p className="text-neutral-500 text-sm mt-1">{description}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MapPlaceholder
