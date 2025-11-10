"use client";

import { useState, useCallback } from "react";
import { addToFavorites, removeFromFavorites, getFavorites } from "@/services/api";

export function useFavorites(userId) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFavorites = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const response = await getFavorites(userId);
      if (response.success) {
        setFavorites(response.data || []);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const addFavorite = useCallback(
    async (productId) => {
      if (!userId) return;
      try {
        const response = await addToFavorites(userId, productId);
        if (response.success) {
          setFavorites([...favorites, productId]);
        }
      } catch (err) {
        setError(err.message);
      }
    },
    [userId, favorites]
  );

  const removeFavorite = useCallback(
    async (productId) => {
      if (!userId) return;
      try {
        const response = await removeFromFavorites(userId, productId);
        if (response.success) {
          setFavorites(favorites.filter((id) => id !== productId));
        }
      } catch (err) {
        setError(err.message);
      }
    },
    [userId, favorites]
  );

  const isFavorite = useCallback(
    (productId) => favorites.includes(productId),
    [favorites]
  );

  return {
    favorites,
    loading,
    error,
    addFavorite,
    removeFavorite,
    isFavorite,
    fetchFavorites,
  };
}
