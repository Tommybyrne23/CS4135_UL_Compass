import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

export type FavoriteType = "room" | "building" | "service";

export interface Favorite {
  id: string;
  type: FavoriteType;
}

interface FavoritesContextType {
  favorites: Favorite[];
  addFavorite: (id: string, type: FavoriteType) => void;
  removeFavorite: (id: string, type: FavoriteType) => void;
  isFavorite: (id: string, type: FavoriteType) => boolean;
  getFavoritesByType: (type: FavoriteType) => Favorite[];
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const storedFavorites = localStorage.getItem(
        `ul_compass_favorites_${user.id}`
      );
      if (storedFavorites) {
        try {
          const parsed = JSON.parse(storedFavorites);
          // Handle legacy format (string array) and convert to new format
          if (Array.isArray(parsed) && parsed.length > 0) {
            if (typeof parsed[0] === "string") {
              // Legacy format: convert all strings to room favorites
              const converted = parsed.map((id: string) => ({
                id,
                type: "room" as FavoriteType,
              }));
              setFavorites(converted);
            } else {
              // New format
              setFavorites(parsed);
            }
          }
        } catch (e) {
          console.error("Failed to parse favorites", e);
        }
      }
    } else {
      setFavorites([]);
    }
  }, [user]);

  const addFavorite = (id: string, type: FavoriteType) => {
    if (!user) return;

    if (isFavorite(id, type)) return; // Don't add duplicates

    const newFavorites = [...favorites, { id, type }];
    setFavorites(newFavorites);
    localStorage.setItem(
      `ul_compass_favorites_${user.id}`,
      JSON.stringify(newFavorites)
    );
  };

  const removeFavorite = (id: string, type: FavoriteType) => {
    if (!user) return;

    const newFavorites = favorites.filter(
      (fav) => !(fav.id === id && fav.type === type)
    );
    setFavorites(newFavorites);
    localStorage.setItem(
      `ul_compass_favorites_${user.id}`,
      JSON.stringify(newFavorites)
    );
  };

  const isFavorite = (id: string, type: FavoriteType) => {
    return favorites.some((fav) => fav.id === id && fav.type === type);
  };

  const getFavoritesByType = (type: FavoriteType) => {
    return favorites.filter((fav) => fav.type === type);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        getFavoritesByType,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
