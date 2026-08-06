export interface Product {
  id: string
  name: string
  description: string
  price: number
  rating: number
  image: string
  category: string
  subCategory?: string
  ingredients?: string[]
  isPopular?: boolean
  isAvailable?: boolean
  sizes?: { size: 'Small' | 'Medium' | 'Large' | 'Full'; price: number }[]
}

export interface Category {
  id: string
  name: string
  icon: string
}

export interface ReviewData {
  id: string
  name: string
  review: string
  rating: number
  avatar: string
  role: string
}

export interface Deal {
  id: string
  name: string
  description: string
  price: number
  image: string
  items: string[]
}

export interface IceShakeItem {
  id: string
  name: string
  smallPrice: number
  mediumPrice: number
  largePrice: number
  image: string
}

export interface IceCreamItem {
  id: string
  name: string
  price: number
  image: string
}

// ===== HOME PAGE CATEGORIES =====
export const homeCategories: Category[] = [
  { id: '1', name: 'Pizza', icon: '🍕' },
  { id: '2', name: 'Burger', icon: '🍔' },
  { id: '3', name: 'Wrap', icon: '🌯' },
  { id: '4', name: 'Side Bar', icon: '🍟' },
  { id: '5', name: 'Ice Shake', icon: '🥤' },
  { id: '6', name: 'Ice Cream', icon: '🍨' },
  { id: '7', name: 'Deals', icon: '🎁' },
]

// ===== MENU PAGE CATEGORIES =====
export const menuCategories = ['All', 'Pizza', 'Burger', 'Wrap', 'Side Bar', 'Ice Shake', 'Ice Cream', 'Deals']

// ===== PIZZA SUBCATEGORIES =====
export const pizzaSubCategories = ['Regular', 'Special', 'Signature']

// ===== DEALS - EMPTY, LOADED FROM FIRESTORE =====
export const deals: Deal[] = []

// ===== ICE SHAKE - EMPTY, LOADED FROM FIRESTORE =====
export const iceShakes: IceShakeItem[] = []

// ===== ICE CREAM - EMPTY, LOADED FROM FIRESTORE =====
export const iceCreams: IceCreamItem[] = []

// ===== PLACEHOLDER PRODUCTS (empty for manual editing) =====
export const burgers: Product[] = []
export const wraps: Product[] = []
export const sideBarItems: Product[] = []
export const pizzas: Product[] = []

// ===== REVIEWS - EMPTY, LOADED FROM FIRESTORE =====
export const reviews: ReviewData[] = []

export const whyChooseUs = [
  {
    id: '1',
    title: 'Fresh Ingredients',
    description: 'We source only the freshest, highest-quality ingredients from local farms and trusted suppliers.',
    icon: '🥬',
  },
  {
    id: '2',
    title: 'Fast Delivery',
    description: 'Hot and fresh pizza delivered to your doorstep in under 30 minutes, guaranteed.',
    icon: '⚡',
  },
  {
    id: '3',
    title: 'Best Quality',
    description: 'Handcrafted by expert pizzaiolos using traditional techniques passed down through generations.',
    icon: '🏆',
  },
  {
    id: '4',
    title: 'Affordable Prices',
    description: 'Premium quality at prices that will not break the bank. Great value for every meal.',
    icon: '💰',
  },
]

// Legacy exports for compatibility
export const categories = homeCategories
export const featuredProducts: Product[] = []
export const menuProducts: Product[] = []