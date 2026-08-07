import { FiMapPin, FiExternalLink } from 'react-icons/fi'
import { useSettings } from '../hooks/useSettings'

interface MapPlaceholderProps {
  title?: string
  description?: string
}

const MapPlaceholder = ({
  title = 'Find Us',
  description = 'Google Maps will be connected here soon.',
}: MapPlaceholderProps) => {
  const { settings, loading } = useSettings()

  if (loading) {
    return (
      <div className="w-full aspect-video max-h-96 bg-neutral-100 rounded-2xl border border-neutral-200 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // ✅ If mapUrl exists in admin settings, show real Google Map
  if (settings.mapUrl) {
    return (
      <div className="w-full rounded-2xl overflow-hidden border border-neutral-200 shadow-lg bg-white">
        <iframe
          src={settings.mapUrl}
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Restaurant Location"
          className="w-full"
        />
        <div className="p-4 bg-white border-t border-neutral-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <FiMapPin className="w-4 h-4 text-primary" />
            <span className="font-medium">{settings.address}</span>
          </div>
          <a
            href={settings.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-primary font-medium hover:underline"
          >
            Open in Google Maps
            <FiExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    )
  }

  // Fallback placeholder when no mapUrl
  return (
    <div className="w-full aspect-video max-h-96 bg-neutral-100 rounded-2xl border-2 border-dashed border-neutral-200 flex flex-col items-center justify-center text-center p-8">
      <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mb-4">
        <FiMapPin className="w-8 h-8 text-primary-600" />
      </div>
      <h3 className="font-heading font-semibold text-lg text-neutral-900 mb-2">{title}</h3>
      <p className="text-neutral-500 text-sm max-w-md">{description}</p>
    </div>
  )
}

export default MapPlaceholder