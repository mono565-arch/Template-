import { collection, addDoc, query, orderBy, onSnapshot, updateDoc, doc, where } from 'firebase/firestore'
import { db } from '../firebase/firebase'
import { LS_KEYS, getItem, setItem } from './localStorage'

export type NotificationType =
  | 'order'
  | 'review'
  | 'message'
  | 'coupon'
  | 'order_cancelled'
  | 'product_added'
  | 'product_updated'
  | 'product_deleted'
  | 'category_added'
  | 'category_deleted'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  time: string
  read: boolean
  link?: string
}

const NOTIFICATION_ICONS: Record<NotificationType, string> = {
  order: '🟢',
  review: '🟡',
  message: '🔵',
  coupon: '🔴',
  order_cancelled: '🔴',
  product_added: '🟢',
  product_updated: '🟡',
  product_deleted: '🔴',
  category_added: '🟢',
  category_deleted: '🔴',
}

export function addNotification(notification: Omit<Notification, 'id' | 'time' | 'read'>): void {
  // 🔥 Firestore mein save karo
  addDoc(collection(db, 'notifications'), {
    ...notification,
    time: new Date().toISOString(),
    read: false,
  }).catch(err => console.error('Notification save error:', err))

  // Local fallback
  const notifications = getItem<Notification[]>(LS_KEYS.NOTIFICATIONS, [])
  const newNotification: Notification = {
    ...notification,
    id: 'notif-' + Date.now() + '-' + Math.random().toString(36).substring(2, 8),
    time: new Date().toISOString(),
    read: false,
  }
  notifications.unshift(newNotification)
  if (notifications.length > 100) notifications.pop()
  setItem(LS_KEYS.NOTIFICATIONS, notifications)
}

// 🔥 Firestore se realtime notifications padho
export function subscribeToNotifications(callback: (notifications: Notification[]) => void) {
  const q = query(collection(db, 'notifications'), orderBy('time', 'desc'))
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((d) => ({
      ...d.data(),
      id: d.id,
    } as Notification))
    callback(data)
  }, (err) => {
    console.error('Notifications subscription error:', err)
  })
}

// 🔥 Firestore mein mark as read
export async function markNotificationRead(id: string): Promise<void> {
  try {
    await updateDoc(doc(db, 'notifications', id), { read: true })
  } catch (err) {
    console.error('Mark read error:', err)
  }
  // Local bhi update karo
  const notifications = getItem<Notification[]>(LS_KEYS.NOTIFICATIONS, [])
  const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
  setItem(LS_KEYS.NOTIFICATIONS, updated)
}

// 🔥 Firestore mein mark all as read
export async function markAllNotificationsRead(): Promise<void> {
  // Note: Firestore mein bulk update ke liye alag logic chahiye hoti hai
  // Yeh sirf unread ko individually update karega
  try {
    const q = query(collection(db, 'notifications'), where('read', '==', false))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docs.forEach((d) => {
        updateDoc(doc(db, 'notifications', d.id), { read: true })
      })
    })
    // Cleanup after short delay
    setTimeout(() => unsubscribe(), 3000)
  } catch (err) {
    console.error('Mark all read error:', err)
  }
  // Local bhi update karo
  const notifications = getItem<Notification[]>(LS_KEYS.NOTIFICATIONS, [])
  const updated = notifications.map((n) => ({ ...n, read: true }))
  setItem(LS_KEYS.NOTIFICATIONS, updated)
}

export function getNotificationIcon(type: NotificationType): string {
  return NOTIFICATION_ICONS[type] || '🔵'
}

// Local fallback functions (agar kisi jagah pe sirf local chahiye ho)
export function getNotifications(): Notification[] {
  return getItem<Notification[]>(LS_KEYS.NOTIFICATIONS, [])
}

export function getUnreadCount(): number {
  return getItem<Notification[]>(LS_KEYS.NOTIFICATIONS, []).filter((n) => !n.read).length
}

export function getLatestNotifications(limit: number = 5): Notification[] {
  return getItem<Notification[]>(LS_KEYS.NOTIFICATIONS, []).slice(0, limit)
}