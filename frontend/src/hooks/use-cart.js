"use client"

import { useState, useCallback } from "react";
import { addToCart, removeFromCart, getCart } from "@/services/api";

export function useCart(userId) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchCart = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    try {
      const response = await getCart(userId)
      if (response.success) {
        setItems(response.data || [])
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [userId])

  const addItem = useCallback(
    async (productId, quantity) => {
      if (!userId) return
      try {
        const response = await addToCart(userId, productId, quantity)
        if (response.success) {
          await fetchCart()
        }
      } catch (err) {
        setError(err.message)
      }
    },
    [userId, fetchCart]
  )

  const removeItem = useCallback(
    async (productId) => {
      if (!userId) return
      try {
        const response = await removeFromCart(userId, productId)
        if (response.success) {
          await fetchCart()
        }
      } catch (err) {
        setError(err.message)
      }
    },
    [userId, fetchCart]
  )

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return { items, loading, error, addItem, removeItem, clearCart, fetchCart, total }
}
