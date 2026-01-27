import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/firebase";

interface User {
  id: string;
  email: string;
  firstName: string;
  middleName?: string; 
  surname?: string;
  dob?: string;
  age?: number;
  gender?: string;
  maritalStatus?: string;
  caste?: string;
  education?: string;
  employment?: string;
  mobile?: string;
  state?: string;
  profilePhoto?: string;
  documents?: any;
  savedSchemes: string[];
  recentlyViewed: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Partial<User> & { password: string }) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  saveScheme: (id: string) => void;
  unsaveScheme: (id: string) => void;
  addToRecentlyViewed: (id: string) => void;
  setFirebaseUser: (firebaseUser: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

const calculateAge = (dob?: string) => {
  if (!dob) return undefined;
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return age;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("schemeHubUser");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  // Firebase auto login (Google users only)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) return;

      const users = JSON.parse(localStorage.getItem("schemeHubUsers") || "[]");
      let existingUser = users.find((u: any) => u.email === firebaseUser.email);

      if (!existingUser) {
        const newUser = {
          id: firebaseUser.uid,
          email: firebaseUser.email || "",
          firstName: firebaseUser.displayName || "User",
          profilePhoto: firebaseUser.photoURL || "",
          savedSchemes: [],
          recentlyViewed: [],
        };

        users.push(newUser);
        localStorage.setItem("schemeHubUsers", JSON.stringify(users));
        existingUser = newUser;
      }

      setUser(existingUser);
      localStorage.setItem("schemeHubUser", JSON.stringify(existingUser));
    });

    return () => unsubscribe();
  }, []);

  const setFirebaseUser = (firebaseUser: any) => {
    const users = JSON.parse(localStorage.getItem("schemeHubUsers") || "[]");

    let existingUser = users.find((u: any) => u.email === firebaseUser.email);

    if (!existingUser) {
      const newUser = {
        id: firebaseUser.uid,
        email: firebaseUser.email || "",
        firstName: firebaseUser.displayName || "User",
        profilePhoto: firebaseUser.photoURL || "",
        savedSchemes: [],
        recentlyViewed: [],
      };

      users.push(newUser);
      localStorage.setItem("schemeHubUsers", JSON.stringify(users));
      existingUser = newUser;
    }

    setUser(existingUser);
    localStorage.setItem("schemeHubUser", JSON.stringify(existingUser));
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem("schemeHubUsers") || "[]");
    const foundUser = users.find((u: any) => u.email === email && u.password === password);

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      userWithoutPassword.age = calculateAge(userWithoutPassword.dob);
      setUser(userWithoutPassword);
      localStorage.setItem("schemeHubUser", JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };

  const register = async (userData: Partial<User> & { password: string }): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem("schemeHubUsers") || "[]");

    if (users.find((u: any) => u.email === userData.email)) return false;

    const newUser = {
      id: Date.now().toString(),
      ...userData,
      savedSchemes: [],
      recentlyViewed: [],
      age: calculateAge(userData.dob),
    };

    users.push(newUser);
    localStorage.setItem("schemeHubUsers", JSON.stringify(users));

    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword as User);
    localStorage.setItem("schemeHubUser", JSON.stringify(userWithoutPassword));
    return true;
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    localStorage.removeItem("schemeHubUser");
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;

    const updated = {
      ...user,
      ...updates,
      age: updates.dob ? calculateAge(updates.dob) : user.age,
    };

    setUser(updated);
    localStorage.setItem("schemeHubUser", JSON.stringify(updated));

    const users = JSON.parse(localStorage.getItem("schemeHubUsers") || "[]");
    const index = users.findIndex((u: any) => u.id === user.id);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      localStorage.setItem("schemeHubUsers", JSON.stringify(users));
    }
  };

  const saveScheme = (id: string) => {
    if (!user) return;
    if (!user.savedSchemes.includes(id)) {
      updateUser({ savedSchemes: [...user.savedSchemes, id] });
    }
  };

  const unsaveScheme = (id: string) => {
    if (!user) return;
    updateUser({ savedSchemes: user.savedSchemes.filter(s => s !== id) });
  };

  const addToRecentlyViewed = (id: string) => {
    if (!user) return;
    const list = [id, ...user.recentlyViewed.filter(i => i !== id)].slice(0, 10);
    updateUser({ recentlyViewed: list });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateUser,
        saveScheme,
        unsaveScheme,
        addToRecentlyViewed,
        setFirebaseUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
