import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/firebase";
import { loginUser } from "@/services/authService";
import api from "@/utils/api";

export interface User {
  id: string;
  _id?: string;
  email: string;
  firstName: string;
  middleName?: string;
  surname?: string;
  dob?: string;
  age?: number;
  gender?: string;
  caste?: string;
  education?: string;
  employment?: string;
  mobile?: string;
  state?: string;
  profilePhoto?: string;
  documents?: {
    [key: string]: any;
    others?: string[];
  };
  savedSchemes: string[];
  recentlyViewed: string[];
}


interface ProfileResponse {
  message: string;
  user: User;
}

interface AuthContextType {
  register: (data: any) => Promise<boolean>;
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setFirebaseUser: (firebaseUser: any) => void;

  // 🔥 ADD THESE
  saveScheme: (schemeId: string) => void;
  unsaveScheme: (schemeId: string) => void;
  addToRecentlyViewed: (schemeId: string) => void;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("schemeHubUser");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) return;

      const googleUser: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email || "",
        firstName: firebaseUser.displayName || "User",
        profilePhoto: firebaseUser.photoURL || "",
        savedSchemes: [],
        recentlyViewed: [],
      };

      setUser(googleUser);
      localStorage.setItem("schemeHubUser", JSON.stringify(googleUser));
    });

    return () => unsub();
  }, []);
  const register = async (data: any): Promise<boolean> => {
    try {
      // 1️⃣ Register user
      await api.post("/auth/register", data);

      // 2️⃣ Login immediately
      const loginRes = await loginUser(data.email, data.password);
      if (!loginRes?.token) return false;

      // 3️⃣ Save token
      localStorage.setItem("token", loginRes.token);

      // 4️⃣ Fetch profile
      const profileRes = await api.get<ProfileResponse>("/auth/profile");
      const u = profileRes.data.user;

      const calculateAge = (dob?: string) => {
        if (!dob) return undefined;
        const birth = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
          age--;
        }
        return age;
      };

      // 5️⃣ SAFE USER (same as login)
      const safeUser: User = {
        id: u._id,
        _id: u._id,
        email: u.email,
        firstName: u.firstName,
        middleName: u.middleName || "",
        surname: u.surname || "",
        dob: u.dob,
        age: calculateAge(u.dob),
        gender: u.gender,
        mobile: u.mobile || "",
        state: u.state || "",
        caste: u.caste || "",
        education: u.education || "",
        employment: u.employment || "",
        savedSchemes: [],
        recentlyViewed: [],
        documents: {},
        profilePhoto: "",
      };

      // 6️⃣ SAVE USER
      setUser(safeUser);
      localStorage.setItem("schemeHubUser", JSON.stringify(safeUser));

      return true;
    } catch (error: any) {
      const msg =
        error?.response?.data?.message || "Registration failed";
      throw new Error(msg);
    }
  };
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // 1️⃣ LOGIN API
      const loginRes = await loginUser(email, password);
      if (!loginRes?.token) return false;

      // 2️⃣ SAVE TOKEN
      localStorage.setItem("token", loginRes.token);

      // 3️⃣ FETCH PROFILE
      const profileRes = await api.get<ProfileResponse>("/auth/profile");
      const u = profileRes.data.user;
      const calculateAge = (dob?: string) => {
        if (!dob) return undefined;
        const birth = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
          age--;
        }
        return age;
      };
      // 4️⃣ FORCE SAFE USER SHAPE (🔥 IMPORTANT)
      const safeUser: User = {
        id: u._id,
        _id: u._id,
        email: u.email,
        firstName: u.firstName,
        middleName: u.middleName || "",
        surname: u.surname || "",
        dob: u.dob,
        age: calculateAge(u.dob), // 🔥 ADD THIS
        gender: u.gender,
        mobile: u.mobile || "",
        state: u.state || "",
        caste: u.caste || "",
        education: u.education || "",
        employment: u.employment || "",
        savedSchemes: [],
        recentlyViewed: [],
        documents: {},
        profilePhoto: "",
      };



      // 5️⃣ SAVE USER
      setUser(safeUser);
      localStorage.setItem("schemeHubUser", JSON.stringify(safeUser));

      return true;
    } catch (err) {
      console.error("LOGIN ERROR:", err);
      return false;
    }
  };



  const logout = async () => {
    await signOut(auth);
    setUser(null);
    localStorage.removeItem("schemeHubUser");
    localStorage.removeItem("token");
  };

  const setFirebaseUser = (firebaseUser: any) => {
    const googleUser: User = {
      id: firebaseUser.uid,
      email: firebaseUser.email || "",
      firstName: firebaseUser.displayName || "User",
      profilePhoto: firebaseUser.photoURL || "",
      savedSchemes: [],
      recentlyViewed: [],
    };

    setUser(googleUser);
    localStorage.setItem("schemeHubUser", JSON.stringify(googleUser));
  };
  const updateUser = (data: Partial<User>) => {
    setUser(prev => {
      if (!prev) return prev;
      const updated = { ...prev, ...data };
      localStorage.setItem("schemeHubUser", JSON.stringify(updated));
      return updated;
    });
  };
const unsaveScheme = async (schemeId: string) => {
  if (!user) return;

  try {
    const res = await api.delete<{
      savedSchemes: string[];
    }>(`/saved-schemes/${schemeId}`);

    const updatedUser = {
      ...user,
      savedSchemes: res.data.savedSchemes,
    };

    setUser(updatedUser);
    localStorage.setItem("schemeHubUser", JSON.stringify(updatedUser));
  } catch (err) {
    console.error("Unsave scheme failed", err);
  }
};



  const saveScheme = async (schemeId: string) => {
    if (!user) return;

    try {
      const res = await api.post<{
        savedSchemes: string[];
      }>("/saved-schemes", { schemeId });

      const updatedUser = {
        ...user,
        savedSchemes: res.data.savedSchemes,
      };

      setUser(updatedUser);
      localStorage.setItem("schemeHubUser", JSON.stringify(updatedUser));
    } catch (err) {
      console.error("Save scheme failed", err);
    }
  };


  const addToRecentlyViewed = (schemeId: string) => {
    setUser(prev => {
      if (!prev) return prev;

      const updated = {
        ...prev,
        recentlyViewed: [
          schemeId,
          ...prev.recentlyViewed.filter(id => id !== schemeId),
        ].slice(0, 10), // last 10 only
      };

      localStorage.setItem("schemeHubUser", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        setFirebaseUser,
        saveScheme,
        unsaveScheme,
        addToRecentlyViewed,
        updateUser,
      }}
    >

      {children}
    </AuthContext.Provider>
  );
};
