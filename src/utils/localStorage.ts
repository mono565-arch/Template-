// Centralized LocalStorage keys and helpers
export const LS_KEYS = {
  ORDERS: 'pizza_saucy_orders',
  PRODUCTS: 'pizza_saucy_products',
  CATEGORIES: 'pizza_saucy_categories',
  REVIEWS: 'pizza_saucy_reviews',
  MESSAGES: 'pizza_saucy_messages',
  COUPONS: 'pizza_saucy_coupons',
  CART: 'pizza_saucy_cart',
  AUTH: 'pizza_saucy_auth',
  ADMIN_AUTH: 'pizza_saucy_admin_auth',
  USERS: 'pizza_saucy_users',
  NOTIFICATIONS: 'pizza_saucy_notifications',
  ORDER_COUNTER: 'pizza_saucy_order_counter',
  SETTINGS: 'pizza_saucy_settings',
} as const

export function getItem<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key)
    if (stored) return JSON.parse(stored)
  } catch {
    // ignore parse errors
  }
  return defaultValue
}

export function setItem<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value))
}

export function removeItem(key: string): void {
  localStorage.removeItem(key)
}
