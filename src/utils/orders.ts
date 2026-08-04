import { LS_KEYS, getItem, setItem } from './localStorage'

export function generateOrderNumber(): string {
  const counter = getItem<number>(LS_KEYS.ORDER_COUNTER, 1000)
  const nextCounter = counter + 1
  setItem(LS_KEYS.ORDER_COUNTER, nextCounter)
  return `ORD-${nextCounter}`
}

export function getOrderNumberDisplay(orderId: string): string {
  if (orderId.startsWith('ORD-')) return orderId
  return orderId
}
