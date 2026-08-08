import { createContext, useContext, useState, ReactNode } from 'react'
import type { Product, ProductSize } from '../types'

export interface CartItem extends Product {
  selectedSize?: ProductSize
  cartPrice: number
  quantity: number
}

interface CartContextType {
  cartItems: CartItem[]
  items: CartItem[]              // ✅ Alias for Cart.tsx
  addToCart: (item: CartItem) => void
  addItem: (item: CartItem) => void
  removeFromCart: (id: string, size?: string) => void
  removeItem: (id: string, size?: string) => void  // ✅ Alias for Cart.tsx
  updateQuantity: (id: string, quantity: number, size?: string) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  const addToCart = (item: CartItem) => {
    setCartItems((prev) => {
      const exists = prev.find(
        (i) => i.id === item.id && i.selectedSize?.size === item.selectedSize?.size
      )
      if (exists) {
        return prev.map((i) =>
          i.id === item.id && i.selectedSize?.size === item.selectedSize?.size
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      }
      return [...prev, item]
    })
  }

  const removeFromCart = (id: string, size?: string) => {
    setCartItems((prev) =>
      prev.filter((i) => !(i.id === id && i.selectedSize?.size === size))
    )
  }

  const updateQuantity = (id: string, quantity: number, size?: string) => {
    if (quantity <= 0) {
      removeFromCart(id, size)
      return
    }
    setCartItems((prev) =>
      prev.map((i) =>
        i.id === id && i.selectedSize?.size === size ? { ...i, quantity } : i
      )
    )
  }

  const clearCart = () => setCartItems([])

  const totalItems = cartItems.reduce((sum, i) => sum + i.quantity, 0)
  const totalPrice = cartItems.reduce((sum, i) => sum + i.cartPrice * i.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        cartItems,
        items: cartItems,              // ✅ Alias
        addToCart,
        addItem: addToCart,            // ✅ Alias
        removeFromCart,
        removeItem: removeFromCart,    // ✅ Alias
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}

export const useCartContext = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCartContext must be used within CartProvider')
  return context
}