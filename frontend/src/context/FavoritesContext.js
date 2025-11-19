"use client";

import { createContext, useState, useEffect, useCallback } from "react";
import { getFavorites, addFavorite as apiAddFavorite, removeFavorite as apiRemoveFavorite } from "../services/api";

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  // Fetch favorites from backend
  const fetchFavorites = useCallback(async () => {
    if (!userId) return;
    try {
      const data = await getFavorites(userId); 
      // backend returns [{id: favId, menuItem: {...}}]
      setFavorites(data.map(f => f.menuItem));
    } catch (err) {
      console.error("Failed to fetch favorites:", err);
    }
  }, [userId]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  // Add favorite
  const addFavorite = async (menuItem) => {
    if (!userId) return;
    try {
      await apiAddFavorite(userId, menuItem.id); // API expects menuItemId
      setFavorites(prev => [...prev, menuItem]); // store full object in state
    } catch (err) {
      console.error("Failed to add favorite:", err);
    }
  };

  // Remove favorite
  const removeFavorite = async (menuItem) => {
    if (!userId) return;
    try {
      await apiRemoveFavorite(userId, menuItem.id);
      setFavorites(prev => prev.filter(fav => fav.id !== menuItem.id));
    } catch (err) {
      console.error("Failed to remove favorite:", err);
    }
  };

  const isFavorite = (menuItem) => favorites.some(fav => fav.id === menuItem.id);

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite, fetchFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
};
