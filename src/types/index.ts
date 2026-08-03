export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  phone?: string
  address?: string
  role: 'customer' | 'admin'
}

export type PizzaSize = 'Small' | 'Medium' | 'Large'

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
  size?: PizzaSize
}

export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  image?: string
  isAvailable: boolean
}

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled'

export interface Order {
  id: string
  items: CartItem[]
  total: number
  status: OrderStatus
  createdAt: string
  deliveryAddress?: string
  customerName?: string
  customerPhone?: string
}

export interface Review {
  id: string
  name: string
  email: string
  review: string
  rating: number
  product: string
  date: string
  pinned?: boolean
  avatar?: string
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  message: string
  date: string
  read: boolean
}
