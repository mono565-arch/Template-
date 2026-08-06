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

// ===== DEALS =====
export const deals: Deal[] = [
  { id: 'd1', name: 'Deal No 1', description: '2 Small Pizza + 1 Half Liter Drink', price: 1350, image: '', items: ['2 Small Pizza', '1 Half Liter Drink'] },
  { id: 'd2', name: 'Deal No 2', description: '2 Medium Pizza + 1.5 Liter Drink', price: 2300, image: '', items: ['2 Medium Pizza', '1.5 Liter Drink'] },
  { id: 'd3', name: 'Deal No 3', description: '2 Large Pizza + 1.5 Liter Drink', price: 3300, image: '', items: ['2 Large Pizza', '1.5 Liter Drink'] },
  { id: 'd4', name: 'Deal No 4', description: '2 Family Pizza + 1.5 Liter Drink', price: 4400, image: '', items: ['2 Family Pizza', '1.5 Liter Drink'] },
  { id: 'd5', name: 'Deal No 5', description: '1 Large Pizza + 10 Pcs Nuggets + 2 Zinger Burgers + 1.5 Liter Drink', price: 3000, image: '', items: ['1 Large Pizza', '10 Pcs Nuggets', '2 Zinger Burgers', '1.5 Liter Drink'] },
  { id: 'd6', name: 'Deal No 6', description: '1 Family Pizza + 2 Zinger Burgers + 1 Large Fries + 1.5 Liter Drink', price: 3300, image: '', items: ['1 Family Pizza', '2 Zinger Burgers', '1 Large Fries', '1.5 Liter Drink'] },
  { id: 'd7', name: 'Deal No 7', description: '2 Chicken Burgers + 1 Half Liter Drink', price: 700, image: '', items: ['2 Chicken Burgers', '1 Half Liter Drink'] },
  { id: 'd8', name: 'Deal No 8', description: '3 Zinger Burgers + 1 Liter Drink', price: 1200, image: '', items: ['3 Zinger Burgers', '1 Liter Drink'] },
  { id: 'd9', name: 'Deal No 9', description: '4 Zinger Burgers + 1.5 Liter Drink', price: 1600, image: '', items: ['4 Zinger Burgers', '1.5 Liter Drink'] },
  { id: 'd10', name: 'Deal No 10', description: '6 Zinger Burgers + 1.5 Liter Drink', price: 2300, image: '', items: ['6 Zinger Burgers', '1.5 Liter Drink'] },
  { id: 'd11', name: 'Deal No 11', description: '8 Zinger Burgers + 1.5 Liter Drink', price: 3000, image: '', items: ['8 Zinger Burgers', '1.5 Liter Drink'] },
]

// ===== ICE SHAKE =====
export const iceShakes: IceShakeItem[] = [
  { id: 'is1', name: 'Mango', smallPrice: 180, mediumPrice: 240, largePrice: 280, image: '' },
  { id: 'is2', name: 'Vanilla', smallPrice: 180, mediumPrice: 240, largePrice: 280, image: '' },
  { id: 'is3', name: 'Kulfa King', smallPrice: 180, mediumPrice: 240, largePrice: 280, image: '' },
  { id: 'is4', name: 'Tutti Fruity', smallPrice: 180, mediumPrice: 240, largePrice: 280, image: '' },
  { id: 'is5', name: 'Caramel', smallPrice: 180, mediumPrice: 240, largePrice: 280, image: '' },
  { id: 'is6', name: 'Chocolate', smallPrice: 180, mediumPrice: 240, largePrice: 280, image: '' },
  { id: 'is7', name: 'Strawberry', smallPrice: 180, mediumPrice: 240, largePrice: 280, image: '' },
  { id: 'is8', name: 'Pista Badam', smallPrice: 180, mediumPrice: 240, largePrice: 280, image: '' },
  { id: 'is9', name: 'Pizza Saucy Special', smallPrice: 240, mediumPrice: 280, largePrice: 350, image: '' },
]

// ===== ICE CREAM =====
export const iceCreams: IceCreamItem[] = [
  { id: 'ic1', name: 'Mango', price: 350, image: '' },
  { id: 'ic2', name: 'Vanilla', price: 350, image: '' },
  { id: 'ic3', name: 'King Kulfa', price: 350, image: '' },
  { id: 'ic4', name: 'Tutti Fruity', price: 350, image: '' },
  { id: 'ic5', name: 'Caramel', price: 350, image: '' },
  { id: 'ic6', name: 'Chocolate', price: 350, image: '' },
  { id: 'ic7', name: 'Strawberry', price: 350, image: '' },
  { id: 'ic8', name: 'Pista Badam', price: 350, image: '' },
  { id: 'ic9', name: 'Pizza Saucy Special', price: 460, image: '' },
  { id: 'ic10', name: 'Oreo Shake', price: 410, image: '' },
]

// ===== PLACEHOLDER PRODUCTS (empty for manual editing) =====
export const burgers: Product[] = []
export const wraps: Product[] = []
export const sideBarItems: Product[] = []
export const pizzas: Product[] = []

// ===== REVIEWS =====
export const reviews: ReviewData[] = [
  {
    id: '1',
    name: 'Sarah Mitchell',
    review: 'The best pizza I have ever had! The crust was perfectly crispy and the toppings were incredibly fresh. Delivery was super fast too.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    role: 'Food Blogger',
  },
  {
    id: '2',
    name: 'Michael Chen',
    review: 'Pizza Saucy never disappoints. Their Margherita is absolutely authentic and the quality is consistently amazing. My go-to pizza place!',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    role: 'Regular Customer',
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    review: 'Amazing flavors and great value for money. The family pack is perfect for our weekend dinners. Highly recommend the BBQ Chicken!',
    rating: 4,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    role: 'Verified Buyer',
  },
]

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