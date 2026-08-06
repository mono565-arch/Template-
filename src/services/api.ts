import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  type User as FirebaseUser,
} from 'firebase/auth'
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  Timestamp,
  writeBatch,
} from 'firebase/firestore'
import { app } from '../firebase/firebase'
import type {
  User,
  CartItem,
  Order,
  OrderStatus,
  Review,
  ContactMessage,
} from '../types'
import type { Product, Deal } from '../data'

const auth = getAuth(app)
const db = getFirestore(app)

// ============================================================================
// AUTH SERVICE
// ============================================================================

export const authService = {
  async register(email: string, password: string, name: string): Promise<User> {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(cred.user, { displayName: name })
    const user: User = {
      id: cred.user.uid,
      email: cred.user.email || email,
      name,
      role: 'customer',
    }
    await setDoc(doc(db, 'users', cred.user.uid), user)
    return user
  },

  async login(email: string, password: string): Promise<User> {
    const cred = await signInWithEmailAndPassword(auth, email, password)
    const userDoc = await getDoc(doc(db, 'users', cred.user.uid))
    if (userDoc.exists()) {
      return userDoc.data() as User
    }
    const user: User = {
      id: cred.user.uid,
      email: cred.user.email || email,
      name: cred.user.displayName || email,
      role: 'customer',
    }
    await setDoc(doc(db, 'users', cred.user.uid), user)
    return user
  },

  async logout(): Promise<void> {
    await signOut(auth)
  },

  getCurrentUser(): Promise<User | null> {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        unsubscribe()
        if (!firebaseUser) {
          resolve(null)
          return
        }
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
        if (userDoc.exists()) {
          resolve(userDoc.data() as User)
        } else {
          const user: User = {
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: firebaseUser.displayName || '',
            role: 'customer',
          }
          await setDoc(doc(db, 'users', firebaseUser.uid), user)
          resolve(user)
        }
      })
    })
  },

  onAuthChange(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        callback(null)
        return
      }
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
      if (userDoc.exists()) {
        callback(userDoc.data() as User)
      } else {
        const user: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || '',
          role: 'customer',
        }
        await setDoc(doc(db, 'users', firebaseUser.uid), user)
        callback(user)
      }
    })
  },
}

// ============================================================================
// USER SERVICE
// ============================================================================

export const userService = {
  async getAll(): Promise<User[]> {
    const snapshot = await getDocs(collection(db, 'users'))
    return snapshot.docs.map((d) => d.data() as User)
  },

  async getById(id: string): Promise<User | null> {
    const docSnap = await getDoc(doc(db, 'users', id))
    return docSnap.exists() ? (docSnap.data() as User) : null
  },

  async update(id: string, data: Partial<User>): Promise<void> {
    await updateDoc(doc(db, 'users', id), data as Record<string, unknown>)
  },
}

// ============================================================================
// PRODUCT SERVICE
// ============================================================================

export const productService = {
  async getAll(): Promise<Product[]> {
    const snapshot = await getDocs(query(collection(db, 'products'), orderBy('name')))
    return snapshot.docs.map((d) => ({ ...d.data(), id: d.id } as Product))
  },

  async getById(id: string): Promise<Product | null> {
    const docSnap = await getDoc(doc(db, 'products', id))
    return docSnap.exists() ? ({ ...docSnap.data(), id: docSnap.id } as Product) : null
  },

  async add(product: Omit<Product, 'id'>): Promise<Product> {
    const id = 'prod_' + Date.now()
    const newProduct = { ...product, id } as Product
    await setDoc(doc(db, 'products', id), newProduct)
    return newProduct
  },

  async update(id: string, data: Partial<Product>): Promise<void> {
    await updateDoc(doc(db, 'products', id), data as Record<string, unknown>)
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, 'products', id))
  },
}

// ============================================================================
// CATEGORY SERVICE
// ============================================================================

export interface CategoryItem {
  id: string
  name: string
  icon: string
  count: number
}

export const categoryService = {
  async getAll(): Promise<CategoryItem[]> {
    const snapshot = await getDocs(query(collection(db, 'categories'), orderBy('name')))
    return snapshot.docs.map((d) => d.data() as CategoryItem)
  },

  async add(category: Omit<CategoryItem, 'id' | 'count'>): Promise<CategoryItem> {
    const id = 'cat-' + Date.now()
    const newCategory: CategoryItem = { ...category, id, count: 0 }
    await setDoc(doc(db, 'categories', id), newCategory)
    return newCategory
  },

  async update(id: string, data: Partial<CategoryItem>): Promise<void> {
    await updateDoc(doc(db, 'categories', id), data as Record<string, unknown>)
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, 'categories', id))
  },

  async syncCounts(products: { category: string }[]): Promise<void> {
    const snapshot = await getDocs(collection(db, 'categories'))
    const batch = writeBatch(db)
    snapshot.docs.forEach((d) => {
      const count = products.filter((p) => p.category === d.data().name).length
      batch.update(d.ref, { count })
    })
    await batch.commit()
  },
}

// ============================================================================
// DEAL SERVICE
// ============================================================================

export const dealService = {
  async getAll(): Promise<Deal[]> {
    const snapshot = await getDocs(query(collection(db, 'deals'), orderBy('name')))
    return snapshot.docs.map((d) => ({ ...d.data(), id: d.id } as Deal))
  },

  async getById(id: string): Promise<Deal | null> {
    const docSnap = await getDoc(doc(db, 'deals', id))
    return docSnap.exists() ? ({ ...docSnap.data(), id: docSnap.id } as Deal) : null
  },

  async add(deal: Omit<Deal, 'id'>): Promise<Deal> {
    const id = 'deal_' + Date.now()
    const newDeal = { ...deal, id } as Deal
    await setDoc(doc(db, 'deals', id), newDeal)
    return newDeal
  },

  async update(id: string, data: Partial<Deal>): Promise<void> {
    await updateDoc(doc(db, 'deals', id), data as Record<string, unknown>)
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, 'deals', id))
  },
}

// ============================================================================
// ORDER SERVICE
// ============================================================================

export const orderService = {
  async getAll(): Promise<Order[]> {
    const snapshot = await getDocs(query(collection(db, 'orders'), orderBy('createdAt', 'desc')))
    return snapshot.docs.map((d) => {
      const data = d.data()
      return {
        ...data,
        id: d.id,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
      } as Order
    })
  },

  async add(order: Omit<Order, 'id'> & { id: string }): Promise<Order> {
    const orderData = {
      ...order,
      createdAt: order.createdAt || new Date().toISOString(),
    }
    await setDoc(doc(db, 'orders', order.id), orderData)
    return orderData as Order
  },

  async updateStatus(id: string, status: OrderStatus): Promise<void> {
    await updateDoc(doc(db, 'orders', id), { status })
  },
}

// ============================================================================
// COUPON SERVICE
// ============================================================================

export interface Coupon {
  id: string
  code: string
  discount: number
  type: 'percentage' | 'fixed'
  minOrder: number
  enabled: boolean
}

export const couponService = {
  async getAll(): Promise<Coupon[]> {
    const snapshot = await getDocs(collection(db, 'coupons'))
    return snapshot.docs.map((d) => ({ ...d.data(), id: d.id } as Coupon))
  },

  async add(coupon: Omit<Coupon, 'id'>): Promise<Coupon> {
    const id = 'coupon-' + Date.now()
    const newCoupon = { ...coupon, id }
    await setDoc(doc(db, 'coupons', id), newCoupon)
    return newCoupon
  },

  async update(id: string, data: Partial<Coupon>): Promise<void> {
    await updateDoc(doc(db, 'coupons', id), data as Record<string, unknown>)
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, 'coupons', id))
  },
}

// ============================================================================
// REVIEW SERVICE
// ============================================================================

export const reviewService = {
  async getAll(): Promise<Review[]> {
    const snapshot = await getDocs(query(collection(db, 'reviews'), orderBy('date', 'desc')))
    return snapshot.docs.map((d) => {
      const data = d.data()
      return {
        ...data,
        id: d.id,
        date: data.date instanceof Timestamp ? data.date.toDate().toISOString() : data.date,
      } as Review
    })
  },

  async add(review: Omit<Review, 'id'>): Promise<Review> {
    const id = 'review-' + Date.now()
    const newReview = { ...review, id }
    await setDoc(doc(db, 'reviews', id), newReview)
    return newReview
  },

  async update(id: string, data: Partial<Review>): Promise<void> {
    await updateDoc(doc(db, 'reviews', id), data as Record<string, unknown>)
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, 'reviews', id))
  },
}

// ============================================================================
// MESSAGE SERVICE
// ============================================================================

export const messageService = {
  async getAll(): Promise<ContactMessage[]> {
    const snapshot = await getDocs(query(collection(db, 'messages'), orderBy('date', 'desc')))
    return snapshot.docs.map((d) => {
      const data = d.data()
      return {
        ...data,
        id: d.id,
        date: data.date instanceof Timestamp ? data.date.toDate().toISOString() : data.date,
      } as ContactMessage
    })
  },

  async add(message: Omit<ContactMessage, 'id'>): Promise<ContactMessage> {
    const id = 'msg-' + Date.now()
    const newMessage = { ...message, id }
    await setDoc(doc(db, 'messages', id), newMessage)
    return newMessage
  },

  async markRead(id: string): Promise<void> {
    await updateDoc(doc(db, 'messages', id), { read: true })
  },
}

// ============================================================================
// SETTINGS SERVICE
// ============================================================================

export interface RestaurantSettings {
  name: string
  phone: string
  email: string
  address: string
  deliveryFee: number
  minOrderAmount: number
  taxRate: number
}

const DEFAULT_SETTINGS: RestaurantSettings = {
  name: 'Pizza Saucy',
  phone: '+92 300 1234567',
  email: 'info@pizzasaucy.com',
  address: '123 Pizza Lane, Gulberg III, Lahore',
  deliveryFee: 150,
  minOrderAmount: 500,
  taxRate: 0,
}

export const settingsService = {
  async get(): Promise<RestaurantSettings> {
    const docSnap = await getDoc(doc(db, 'settings', 'restaurant'))
    if (docSnap.exists()) {
      return docSnap.data() as RestaurantSettings
    }
    await setDoc(doc(db, 'settings', 'restaurant'), DEFAULT_SETTINGS)
    return DEFAULT_SETTINGS
  },

  async update(data: Partial<RestaurantSettings>): Promise<void> {
    await updateDoc(doc(db, 'settings', 'restaurant'), data)
  },
}

// ============================================================================
// CART SERVICE (Firestore-backed with local fallback)
// ============================================================================

const CART_STORAGE_KEY = 'pizza_saucy_cart'

export const cartService = {
  async getCart(userId: string | null): Promise<CartItem[]> {
    if (!userId) {
      try {
        const stored = localStorage.getItem(CART_STORAGE_KEY)
        if (stored) return JSON.parse(stored)
      } catch {
        // ignore
      }
      return []
    }
    const docSnap = await getDoc(doc(db, 'carts', userId))
    return docSnap.exists() ? (docSnap.data().items as CartItem[]) || [] : []
  },

  async saveCart(userId: string | null, items: CartItem[]): Promise<void> {
    if (!userId) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
      return
    }
    await setDoc(doc(db, 'carts', userId), { items })
  },

  async clearCart(userId: string | null): Promise<void> {
    if (!userId) {
      localStorage.removeItem(CART_STORAGE_KEY)
      return
    }
    await setDoc(doc(db, 'carts', userId), { items: [] })
  },
}

// Legacy export for compatibility
export const api = {
  baseURL: '',
}