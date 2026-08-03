import { useState } from 'react'
import {
  FiSave,
  FiMapPin,
  FiPhone,
  FiMail,
  FiClock,
  FiFacebook,
  FiInstagram,
} from 'react-icons/fi'

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    restaurantName: 'Pizza Saucy',
    phone: '+92 (42) 123-4567',
    email: 'hello@pizzasaucy.com',
    address: '123 Pizza Lane, Gulberg III, Lahore, Pakistan',
    mapUrl: '',
    facebook: 'https://facebook.com/pizzasaucy',
    instagram: 'https://instagram.com/pizzasaucy',
    whatsapp: 'https://wa.me/923001234567',
    openingHours: `Mon - Thu: 10:00 AM - 10:00 PM
Fri - Sat: 10:00 AM - 11:00 PM
Sunday: 11:00 AM - 9:00 PM`,
  })

  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading font-semibold text-lg">
          Settings
        </h2>

        <button
          onClick={handleSave}
          className="btn-primary flex items-center gap-2 text-sm py-2 px-4"
        >
          <FiSave className="w-4 h-4" />
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Restaurant Info */}
        <div className="bg-white rounded-xl p-6 border border-neutral-200 space-y-4">
          <h3 className="font-heading font-semibold text-base">
            Restaurant Information
          </h3>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Restaurant Name
            </label>

            <input
              type="text"
              value={settings.restaurantName}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  restaurantName: e.target.value,
                })
              }
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Phone
            </label>

            <div className="relative">
              <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />

              <input
                type="text"
                value={settings.phone}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    phone: e.target.value,
                  })
                }
                className="input pl-9"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Email
            </label>

            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />

              <input
                type="email"
                value={settings.email}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    email: e.target.value,
                  })
                }
                className="input pl-9"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Address
            </label>

            <div className="relative">
              <FiMapPin className="absolute left-3 top-3 w-4 h-4 text-neutral-400" />

              <textarea
                rows={2}
                value={settings.address}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    address: e.target.value,
                  })
                }
                className="input pl-9 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white rounded-xl p-6 border border-neutral-200 space-y-4">
          <h3 className="font-heading font-semibold text-base">
            Social Links
          </h3>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Facebook
            </label>

            <div className="relative">
              <FiFacebook className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />

              <input
                type="url"
                value={settings.facebook}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    facebook: e.target.value,
                  })
                }
                className="input pl-9"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Instagram
            </label>

            <div className="relative">
              <FiInstagram className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />

              <input
                type="url"
                value={settings.instagram}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    instagram: e.target.value,
                  })
                }
                className="input pl-9"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              WhatsApp
            </label>

            <input
              type="url"
              value={settings.whatsapp}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  whatsapp: e.target.value,
                })
              }
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Google Map URL
            </label>

            <input
              type="url"
              value={settings.mapUrl}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  mapUrl: e.target.value,
                })
              }
              className="input"
              placeholder="https://maps.google.com/..."
            />
          </div>
        </div>

        {/* Opening Hours */}
        <div className="bg-white rounded-xl p-6 border border-neutral-200 space-y-4 lg:col-span-2">
          <h3 className="font-heading font-semibold text-base">
            Opening Hours
          </h3>

          <div className="relative">
            <FiClock className="absolute left-3 top-3 w-4 h-4 text-neutral-400" />

            <textarea
              rows={4}
              value={settings.openingHours}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  openingHours: e.target.value,
                })
              }
              className="input pl-9 resize-none"
            />
          </div>
        </div>

      </div>
    </div>
  )
}

export default AdminSettings