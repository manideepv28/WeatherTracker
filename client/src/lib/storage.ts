import { FavoriteLocation } from "@/types/weather";

const FAVORITES_KEY = "weather_favorites";

export function getFavorites(): FavoriteLocation[] {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error loading favorites:", error);
    return [];
  }
}

export function saveFavorites(favorites: FavoriteLocation[]): void {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error("Error saving favorites:", error);
  }
}

export function addFavorite(location: FavoriteLocation): void {
  const favorites = getFavorites();
  if (!favorites.find(fav => fav.id === location.id)) {
    favorites.push(location);
    saveFavorites(favorites);
  }
}

export function removeFavorite(locationId: string): void {
  const favorites = getFavorites();
  const filtered = favorites.filter(fav => fav.id !== locationId);
  saveFavorites(filtered);
}

export function isFavorite(locationId: string): boolean {
  const favorites = getFavorites();
  return favorites.some(fav => fav.id === locationId);
}
