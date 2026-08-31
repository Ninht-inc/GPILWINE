'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'

export interface WineSelectionItem {
  wineId: string
  wineName: string
  bottleSize: string
  quantity: number
  image?: string
  slug?: string
}

interface WineSelectionContextType {
  items: WineSelectionItem[]
  addItem: (item: Omit<WineSelectionItem, 'quantity'> & { quantity?: number }) => void
  removeItem: (wineId: string) => void
  updateQuantity: (wineId: string, quantity: number) => void
  clearSelection: () => void
  totalItems: number
}

const WineSelectionContext = createContext<WineSelectionContextType | undefined>(undefined)

const STORAGE_KEY = 'gpil-wine-selection'

export function WineSelectionProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WineSelectionItem[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setItems(JSON.parse(stored))
    } catch {}
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    }
  }, [items, loaded])

  const addItem = useCallback((item: Omit<WineSelectionItem, 'quantity'> & { quantity?: number }) => {
    setItems(prev => {
      const existing = prev.find(i => i.wineId === item.wineId)
      if (existing) {
        return prev.map(i => i.wineId === item.wineId ? { ...i, quantity: i.quantity + (item.quantity || 1) } : i)
      }
      return [...prev, { ...item, quantity: item.quantity || 1 }]
    })
  }, [])

  const removeItem = useCallback((wineId: string) => {
    setItems(prev => prev.filter(i => i.wineId !== wineId))
  }, [])

  const updateQuantity = useCallback((wineId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems(prev => prev.filter(i => i.wineId !== wineId))
    } else {
      setItems(prev => prev.map(i => i.wineId === wineId ? { ...i, quantity } : i))
    }
  }, [])

  const clearSelection = useCallback(() => {
    setItems([])
  }, [])

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <WineSelectionContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearSelection, totalItems }}>
      {children}
    </WineSelectionContext.Provider>
  )
}

export function useWineSelection() {
  const context = useContext(WineSelectionContext)
  if (!context) throw new Error('useWineSelection must be used within WineSelectionProvider')
  return context
}
