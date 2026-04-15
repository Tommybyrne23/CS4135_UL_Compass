import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

interface FavoritesContextType {
  favorites: string[];
  addFavorite: (roomId: string) => void;
  removeFavorite: (roomId: string) => void;
  isFavorite: (roomId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const storedFavorites = localStorage.getItem(
        `ul_compass_favorites_${user.id}`
      );
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } else {
      setFavorites([]);
    }
  }, [user]);

  const addFavorite = (roomId: string) => {
    if (!user) return;
    
    const newFavorites = [...favorites, roomId];
    setFavorites(newFavorites);
    localStorage.setItem(
      `ul_compass_favorites_${user.id}`,
      JSON.stringify(newFavorites)
    );
  };

  const removeFavorite = (roomId: string) => {
    if (!user) return;
    
    const newFavorites = favorites.filter((id) => id !== roomId);
    setFavorites(newFavorites);
    localStorage.setItem(
      `ul_compass_favorites_${user.id}`,
      JSON.stringify(newFavorites)
    );
  };

  const isFavorite = (roomId: string) => {
    return favorites.includes(roomId);
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, addFavorite, removeFavorite, isFavorite }}
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
