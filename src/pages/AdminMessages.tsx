import { useState, useEffect } from 'react'
import { FiMessageSquare, FiCheck, FiTrash2, FiSearch } from 'react-icons/fi'
import { formatDateTime } from '../utils/formatters'
import type { ContactMessage } from '../types'

const AdminMessages = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    const load = () => {
      const stored = JSON.parse(localStorage.getItem('pizza_saucy_messages') || '[]')
      setMessages(stored.sort((a: ContactMessage, b: ContactMessage) => new Date(b.date).getTime() - new Date(a.date).getTime()))
    }
    load()
    const interval = setInterval(load, 3000)
    return () => clearInterval(interval)
  }, [])

  const markRead = (id: string) => {
    const updated = messages.map((m) => m.id === id ? { ...m, read: true } : m)
    setMessages(updated)
    localStorage.setItem('pizza_saucy_messages', JSON.stringify(updated))
  }

  const deleteMessage = (id: string) => {
    const updated = messages.filter((m) => m.id !== id)
    setMessages(updated)
    localStorage.setItem('pizza_saucy_messages', JSON.stringify(updated))
  }

  const filtered = messages.filter((m) =>
    search.trim() === '' ||
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase()) ||
    m.message.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="font-heading font-bold text-2xl text-neutral-900">Messages</h1>
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search messages..."
            className="input pl-9 text-sm py-2"
          />
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((msg) => (
          <div
            key={msg.id}
            className={`card p-5 transition-all ${!msg.read ? 'border-l-4 border-l-primary bg-primary-50/30' : ''}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-semibold text-sm text-neutral-900">{msg.name}</h3>
                  {!msg.read && <span className="w-2 h-2 bg-primary rounded-full" />}
                </div>
                <p className="text-xs text-neutral-500 mb-2">{msg.email} · {formatDateTime(msg.date)}</p>
                <p className="text-sm text-neutral-700 leading-relaxed">{msg.message}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {!msg.read && (
                  <button
                    onClick={() => markRead(msg.id)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Mark as read"
                  >
                    <FiCheck className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => deleteMessage(msg.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <FiMessageSquare className="w-10 h-10 mx-auto mb-3 text-neutral-300" />
            <p className="text-neutral-500 text-sm">No messages found</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminMessages
