import { useState, useEffect, useCallback } from 'react'
import { LS_KEYS, getItem, setItem } from '../utils/localStorage'
import { menuProducts } from '../data'
import type { Product } from '../data'

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(() => {
    const stored = getItem<Product[]>(LS_KEYS.PRODUCTS, [])
    if (stored.length === 0) {
      setItem(LS_KEYS.PRODUCTS, menuProducts)
      return menuProducts
    }
    return stored
  })

  useEffect(() => {
    setItem(LS_KEYS.PRODUCTS, products)
  }, [products])

  const addProduct = useCallback((product: Omit<Product, 'id'>) => {
    const newProduct: Product = { ...product, id: 'prod-' + Date.now() }
    setProducts((prev) => [...prev, newProduct])
    return newProduct
  }, [])

  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } as Product : p)))
  }, [])

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }, [])

  return { products, setProducts, addProduct, updateProduct, deleteProduct }
}
