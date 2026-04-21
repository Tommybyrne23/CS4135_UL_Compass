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

const API_BASE = "/api";

function getToken() {
  return localStorage.getItem("ul_compass_token");
}

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const { user } = useAuth();

  // Load favorites from API when user changes
  useEffect(() => {
    if (user) {
      const token = getToken();
      if (token) {
        fetch(`${API_BASE}/favorites`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => {
            if (!res.ok) throw new Error("Failed to load favorites");
            return res.json();
          })
          .then((data) => {
            setFavorites(data.favorites || []);
          })
          .catch((err) => {
            console.error("Error loading favorites:", err);
            setFavorites([]);
          });
      }
    } else {
      setFavorites([]);
    }
  }, [user]);

  const addFavorite = async (roomId: string) => {
    if (!user) return;

    const token = getToken();
    if (!token) return;

    // Optimistic update
    setFavorites((prev) => [...prev, roomId]);

    try {
      const res = await fetch(`${API_BASE}/favorites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ roomId }),
      });

      if (!res.ok) {
        // Revert on failure
        setFavorites((prev) => prev.filter((id) => id !== roomId));
      }
    } catch (err) {
      console.error("Error adding favorite:", err);
      setFavorites((prev) => prev.filter((id) => id !== roomId));
    }
  };

  const removeFavorite = async (roomId: string) => {
    if (!user) return;

    const token = getToken();
    if (!token) return;

    // Optimistic update
    setFavorites((prev) => prev.filter((id) => id !== roomId));

    try {
      const res = await fetch(`${API_BASE}/favorites/${roomId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        // Revert on failure
        setFavorites((prev) => [...prev, roomId]);
      }
    } catch (err) {
      console.error("Error removing favorite:", err);
      setFavorites((prev) => [...prev, roomId]);
    }
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
