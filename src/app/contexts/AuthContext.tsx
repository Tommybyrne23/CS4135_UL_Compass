import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("ul_compass_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - in production, this would call your backend API
    const mockUser: User = {
      id: "1",
      email,
      name: email.split("@")[0],
    };
    
    setUser(mockUser);
    localStorage.setItem("ul_compass_user", JSON.stringify(mockUser));
    return true;
  };

  const register = async (
    email: string,
    password: string,
    name: string
  ): Promise<boolean> => {
    // Mock registration - in production, this would call your backend API
    const mockUser: User = {
      id: Date.now().toString(),
      email,
      name,
    };
    
    setUser(mockUser);
    localStorage.setItem("ul_compass_user", JSON.stringify(mockUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("ul_compass_user");
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
