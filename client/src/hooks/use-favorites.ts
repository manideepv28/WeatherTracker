import { useState, useEffect } from "react";
import { FavoriteLocation } from "@/types/weather";
import { getFavorites, addFavorite, removeFavorite, isFavorite } from "@/lib/storage";

interface UseFavoritesResult {
  favorites: FavoriteLocation[];
  addToFavorites: (location: FavoriteLocation) => void;
  removeFromFavorites: (locationId: string) => void;
  isFavoriteLocation: (locationId: string) => boolean;
}

export function useFavorites(): UseFavoritesResult {
  const [favorites, setFavorites] = useState<FavoriteLocation[]>([]);

  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  const addToFavorites = (location: FavoriteLocation) => {
    addFavorite(location);
    setFavorites(getFavorites());
  };

  const removeFromFavorites = (locationId: string) => {
    removeFavorite(locationId);
    setFavorites(getFavorites());
  };

  const isFavoriteLocation = (locationId: string) => {
    return isFavorite(locationId);
  };

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavoriteLocation,
  };
}
