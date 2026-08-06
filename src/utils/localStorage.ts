import { db } from '../firebase/firebase'
import {
  collection,
  doc,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore'
import { authService } from '../services/api'
import type { CartItem, User } from '../types'

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

// In-memory cache synced with Firestore in real-time
const memoryCache: Record<string, unknown> = {}

// ============================================================================
// FIRESTORE REAL-TIME LISTENERS (start immediately at module load)
// ============================================================================

onSnapshot(
  query(collection(db, 'products'), orderBy('name')),
  (snapshot) => {
    memoryCache[LS_KEYS.PRODUCTS] = snapshot.docs.map((d) => ({ ...d.data(), id: d.id }))
  },
  () => {}
)

onSnapshot(
  query(collection(db, 'categories'), orderBy('name')),
  (snapshot) => {
    memoryCache[LS_KEYS.CATEGORIES] = snapshot.docs.map((d) => d.data())
  },
  () => {}
)

onSnapshot(
  query(collection(db, 'orders'), orderBy('createdAt', 'desc')),
  (snapshot) => {
    memoryCache[LS_KEYS.ORDERS] = snapshot.docs.map((d) => {
      const data = d.data()
      return {
        ...data,
        id: d.id,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
      }
    })
  },
  () => {}
)

onSnapshot(
  collection(db, 'coupons'),
  (snapshot) => {
    memoryCache[LS_KEYS.COUPONS] = snapshot.docs.map((d) => ({ ...d.data(), id: d.id }))
  },
  () => {}
)

onSnapshot(
  query(collection(db, 'reviews'), orderBy('date', 'desc')),
  (snapshot) => {
    memoryCache[LS_KEYS.REVIEWS] = snapshot.docs.map((d) => {
      const data = d.data()
      return {
        ...data,
        id: d.id,
        date: data.date?.toDate ? data.date.toDate().toISOString() : data.date,
      }
    })
  },
  () => {}
)

onSnapshot(
  query(collection(db, 'messages'), orderBy('date', 'desc')),
  (snapshot) => {
    memoryCache[LS_KEYS.MESSAGES] = snapshot.docs.map((d) => {
      const data = d.data()
      return {
        ...data,
        id: d.id,
        date: data.date?.toDate ? data.date.toDate().toISOString() : data.date,
      }
    })
  },
  () => {}
)

onSnapshot(
  doc(db, 'settings', 'restaurant'),
  (docSnap) => {
    if (docSnap.exists()) {
      memoryCache[LS_KEYS.SETTINGS] = docSnap.data()
    }
  },
  () => {}
)

onSnapshot(
  collection(db, 'users'),
  (snapshot) => {
    memoryCache[LS_KEYS.USERS] = snapshot.docs.map((d) => d.data())
  },
  () => {}
)

// ============================================================================
// SYNC GET/SET
// ============================================================================

export function getItem<T>(key: string, defaultValue: T): T {
  const cached = memoryCache[key]
  if (cached !== undefined) {
    return cached as T
  }
  return defaultValue
}

export function setItem<T>(key: string, value: T): void {
  memoryCache[key] = value
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // ignore
  }
}

export function removeItem(key: string): void {
  delete memoryCache[key]
  try {
    localStorage.removeItem(key)
  } catch {
    // ignore
  }
}

// ============================================================================
// AUTH HELPERS
// ============================================================================

export async function getAuthUser(): Promise<User | null> {
  const user = await authService.getCurrentUser()
  if (user) {
    memoryCache[LS_KEYS.AUTH] = user
  }
  return user
}

export async function loginUser(email: string, password: string): Promise<User> {
  const user = await authService.login(email, password)
  memoryCache[LS_KEYS.AUTH] = user
  return user
}

export async function registerUser(email: string, password: string, name: string): Promise<User> {
  const user = await authService.register(email, password, name)
  memoryCache[LS_KEYS.AUTH] = user
  return user
}

export async function logoutUser(): Promise<void> {
  await authService.logout()
  delete memoryCache[LS_KEYS.AUTH]
  delete memoryCache[LS_KEYS.ADMIN_AUTH]
  try {
    localStorage.removeItem(LS_KEYS.AUTH)
    localStorage.removeItem(LS_KEYS.ADMIN_AUTH)
  } catch {
    // ignore
  }
}