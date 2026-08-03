export const routes = {
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
  MENU: '/menu',
  CART: '/cart',
  CHECKOUT: '/checkout',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  ADMIN: '/admin',
} as const

export type RouteKey = keyof typeof routes
export type RoutePath = (typeof routes)[RouteKey]
