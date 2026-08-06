import { LS_KEYS, getItem, setItem } from './localStorage'

export interface CategoryItem {
  id: string
  name: string
  icon: string
  count: number
}

const DEFAULT_CATEGORIES: CategoryItem[] = [
  { id: '1', name: 'Pizza', icon: '🍕', count: 0 },
  { id: '2', name: 'Burgers', icon: '🍔', count: 0 },
  { id: '3', name: 'Fries', icon: '🍟', count: 0 },
  { id: '4', name: 'Broast', icon: '🍗', count: 0 },
  { id: '5', name: 'Sandwich', icon: '🥪', count: 0 },
  { id: '6', name: 'Drinks', icon: '🥤', count: 0 },
  { id: '7', name: 'Ice Cream', icon: '🍦', count: 0 },
  { id: '8', name: 'Desserts', icon: '🍰', count: 0 },
]

export function getCategories(): CategoryItem[] {
  const stored = getItem<CategoryItem[]>(LS_KEYS.CATEGORIES, [])
  // Don't fallback to defaults — Firestore listener populates the cache
  if (stored.length === 0) {
    return []
  }
  return stored
}

export function getCategoryNames(): string[] {
  return getCategories().map((c) => c.name)
}

export function getCategoryNamesWithAll(): string[] {
  return ['All', ...getCategoryNames()]
}

export function addCategory(category: Omit<CategoryItem, 'id' | 'count'>): CategoryItem {
  const categories = getCategories()
  const newCategory: CategoryItem = {
    ...category,
    id: 'cat-' + Date.now(),
    count: 0,
  }
  categories.push(newCategory)
  setItem(LS_KEYS.CATEGORIES, categories)
  return newCategory
}

export function updateCategory(id: string, updates: Partial<CategoryItem>): void {
  const categories = getCategories()
  const updated = categories.map((c) => (c.id === id ? { ...c, ...updates } : c))
  setItem(LS_KEYS.CATEGORIES, updated)
}

export function deleteCategory(id: string): void {
  const categories = getCategories()
  const updated = categories.filter((c) => c.id !== id)
  setItem(LS_KEYS.CATEGORIES, updated)
}

export function updateCategoryCounts(products: { category: string }[]): void {
  const categories = getCategories()
  const updated = categories.map((cat) => ({
    ...cat,
    count: products.filter((p) => p.category === cat.name).length,
  }))
  setItem(LS_KEYS.CATEGORIES, updated)
}

export function syncCategoriesWithProducts(products: { category: string }[]): void {
  updateCategoryCounts(products)
}