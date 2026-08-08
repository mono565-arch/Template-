import { useState, useEffect } from 'react'
import { FiMail, FiCheck, FiTrash2, FiRefreshCw } from 'react-icons/fi'
import { collection, onSnapshot, query, orderBy, updateDoc, doc, deleteDoc, Timestamp } from 'firebase/firestore'
import { db } from '../firebase/firebase'
import { formatDateTime } from '../utils/formatters'
import type { ContactMessage } from '../types'

const AdminMessages = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)

  // 🔥 Real-time Firestore subscription
  useEffect(() => {
    setLoading(true)
    const unsubscribe = onSnapshot(
      query(collection(db, 'messages'), orderBy('date', 'desc')),
      (snapshot) => {
        const data = snapshot.docs.map((d) => {
          const docData = d.data()
          return {
            ...docData,
            id: d.id,
            date: docData.date instanceof Timestamp ? docData.date.toDate().toISOString() : docData.date,
          } as ContactMessage
        })
        setMessages(data)
        setLoading(false)
      },
      (err) => {
        console.error('Messages error:', err)
        setLoading(false)
      }
    )
    return () => unsubscribe()
  }, [])

  const markAsRead = async (id: string) => {
    try {
      await updateDoc(doc(db, 'messages', id), { read: true })
    } catch (err) {
      console.error('Mark read error:', err)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return
    try {
      await deleteDoc(doc(db, 'messages', id))
    } catch (err) {
      console.error('Delete error:', err)
    }
  }

  const markAllRead = async () => {
    try {
      const unread = messages.filter((m) => !m.read)
      await Promise.all(unread.map((m) => updateDoc(doc(db, 'messages', m.id), { read: true })))
    } catch (err) {
      console.error('Mark all read error:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading font-semibold text-lg">Messages ({messages.length})</h2>
        <div className="flex gap-2">
          <button onClick={markAllRead} className="btn-outline text-sm py-2">
            <FiCheck className="w-4 h-4" /> Mark All Read
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Message</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Status</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-neutral-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {messages.map((msg) => (
                <tr key={msg.id} className={`hover:bg-neutral-50 ${!msg.read ? 'bg-primary-50/30' : ''}`}>
                  <td className="px-4 py-3 text-sm font-medium text-neutral-900">{msg.name}</td>
                  <td className="px-4 py-3 text-sm text-neutral-600">{msg.email || '-'}</td>
                  <td className="px-4 py-3 text-sm text-neutral-600 max-w-xs truncate">{msg.message}</td>
                  <td className="px-4 py-3 text-sm text-neutral-500 whitespace-nowrap">{msg.date ? formatDateTime(msg.date) : 'N/A'}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
                      msg.read ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {msg.read ? 'Read' : 'Unread'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {!msg.read && (
                        <button onClick={() => markAsRead(msg.id)} className="p-1.5 text-neutral-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Mark as read">
                          <FiCheck className="w-4 h-4" />
                        </button>
                      )}
                      <button onClick={() => handleDelete(msg.id)} className="p-1.5 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {messages.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-neutral-500">
                    <FiMail className="w-8 h-8 mx-auto mb-2 text-neutral-300" />
                    No messages yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminMessages