import { useState, useEffect } from 'react'
import { FiMail, FiTrash2, FiCheck, FiEye, FiClock, FiAlertCircle } from 'react-icons/fi'

interface ContactMessage {
  id: string
  name: string
  email: string
  phone: string
  message: string
  date: string
  read: boolean
}

const AdminMessages = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('pizzaSaucyMessages')
    if (stored) setMessages(JSON.parse(stored))
  }, [])

  useEffect(() => {
    localStorage.setItem('pizzaSaucyMessages', JSON.stringify(messages))
  }, [messages])

  const markAsRead = (id: string) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read: true } : m)))
  }

  const markAllAsRead = () => {
    setMessages((prev) => prev.map((m) => ({ ...m, read: true })))
  }

  const deleteMessage = (id: string) => {
    if (confirm('Delete this message?')) {
      setMessages((prev) => prev.filter((m) => m.id !== id))
    }
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  const unreadCount = messages.filter((m) => !m.read).length

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading font-semibold text-lg text-neutral-900">Messages ({messages.length})</h2>
          <p className="text-sm text-neutral-500 mt-1">{unreadCount} unread</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 text-sm font-medium rounded-lg hover:bg-primary-200 transition-colors"
          >
            <FiCheck className="w-4 h-4" />
            Mark all as read
          </button>
        )}
      </div>

      {unreadCount > 0 && (
        <div className="bg-primary-50 border border-primary-200 rounded-xl px-4 py-3 flex items-center gap-3">
          <FiAlertCircle className="w-5 h-5 text-primary-600 shrink-0" />
          <p className="text-sm text-primary-800 font-medium">You have {unreadCount} new message{unreadCount !== 1 ? 's' : ''}</p>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">From</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase hidden sm:table-cell">Contact</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Message</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase hidden md:table-cell">Date</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-neutral-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {messages.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-neutral-500">No messages yet</td>
                </tr>
              ) : (
                messages.map((msg) => (
                  <tr key={msg.id} className={`hover:bg-neutral-50 ${!msg.read ? 'bg-primary-50/30' : ''}`}>
                    <td className="px-4 py-3">
                      {!msg.read ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                          <FiMail className="w-3 h-3" />
                          New
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                          <FiCheck className="w-3 h-3" />
                          Read
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-neutral-900">{msg.name}</p>
                      <p className="text-xs text-neutral-500">{msg.email}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-600 hidden sm:table-cell">{msg.phone}</td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-neutral-700 max-w-xs truncate">{msg.message}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-neutral-500 hidden md:table-cell whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <FiClock className="w-3 h-3" />
                        {formatDate(msg.date)}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {!msg.read && (
                          <button
                            onClick={() => markAsRead(msg.id)}
                            className="p-1.5 text-neutral-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                            title="Mark as read"
                          >
                            <FiEye className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteMessage(msg.id)}
                          className="p-1.5 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminMessages