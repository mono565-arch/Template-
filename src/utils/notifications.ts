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
  const notifications = getItem<Notification[]>(LS_KEYS.NOTIFICATIONS, [])
  const newNotification: Notification = {
    ...notification,
    id: 'notif-' + Date.now() + '-' + Math.random().toString(36).substring(2, 8),
    time: new Date().toISOString(),
    read: false,
  }
  notifications.unshift(newNotification)
  // Keep only last 100 notifications
  if (notifications.length > 100) notifications.pop()
  setItem(LS_KEYS.NOTIFICATIONS, notifications)
}

export function getNotifications(): Notification[] {
  return getItem<Notification[]>(LS_KEYS.NOTIFICATIONS, [])
}

export function markNotificationRead(id: string): void {
  const notifications = getItem<Notification[]>(LS_KEYS.NOTIFICATIONS, [])
  const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
  setItem(LS_KEYS.NOTIFICATIONS, updated)
}

export function markAllNotificationsRead(): void {
  const notifications = getItem<Notification[]>(LS_KEYS.NOTIFICATIONS, [])
  const updated = notifications.map((n) => ({ ...n, read: true }))
  setItem(LS_KEYS.NOTIFICATIONS, updated)
}

export function getUnreadCount(): number {
  return getItem<Notification[]>(LS_KEYS.NOTIFICATIONS, []).filter((n) => !n.read).length
}

export function getLatestNotifications(limit: number = 5): Notification[] {
  return getItem<Notification[]>(LS_KEYS.NOTIFICATIONS, []).slice(0, limit)
}

export function getNotificationIcon(type: NotificationType): string {
  return NOTIFICATION_ICONS[type] || '🔵'
}
