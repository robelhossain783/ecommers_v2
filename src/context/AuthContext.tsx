"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://127.0.0.1:8000";

export interface CustomerUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
}

interface AuthContextType {
  user: CustomerUser | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

interface RegisterData {
  username: string;
  password: string;
  email?: string;
  first_name?: string;
  last_name?: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CustomerUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("buyfest_customer");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      sessionStorage.removeItem("buyfest_customer");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    try {
      const res = await fetch(`${BASE_URL}/api/auth/customer/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || "Login failed" };
      }
      const customerUser: CustomerUser = {
        id: data.id,
        username: data.username,
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        is_staff: data.is_staff,
      };
      setUser(customerUser);
      try {
        sessionStorage.setItem("buyfest_customer", JSON.stringify(customerUser));
        sessionStorage.setItem("buyfest_last_activity", Date.now().toString());
      } catch (e) { }
      return { success: true };
    } catch {
      return { success: false, error: "Network error. Please try again." };
    }
  }, []);

  const register = useCallback(async (regData: RegisterData) => {
    try {
      const res = await fetch(`${BASE_URL}/api/auth/customer/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(regData),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || "Registration failed" };
      }
      // Auto-login after successful registration
      return await login(regData.username, regData.password);
    } catch {
      return { success: false, error: "Network error. Please try again." };
    }
  }, [login]);

  const logout = useCallback(() => {
    setUser(null);
    try {
      sessionStorage.removeItem("buyfest_customer");
      sessionStorage.removeItem("buyfest_last_activity");
    } catch (e) { }
  }, []);

  // Auto-logout after 5 minutes of inactivity
  useEffect(() => {
    if (!user) return;

    let lastActivity = Date.now();
    try {
      const savedLastActivity = sessionStorage.getItem("buyfest_last_activity");
      if (savedLastActivity) {
        lastActivity = parseInt(savedLastActivity, 10);
      } else {
        sessionStorage.setItem("buyfest_last_activity", lastActivity.toString());
      }
    } catch (e) { }

    const handleActivity = () => {
      const now = Date.now();
      lastActivity = now;
      try {
        sessionStorage.setItem("buyfest_last_activity", now.toString());
      } catch (e) { }
    };

    const events = ["mousemove", "mousedown", "keypress", "scroll", "touchstart", "click"];

    events.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    const interval = setInterval(() => {
      const now = Date.now();
      let storedLastActivity = lastActivity;
      try {
        const savedLastActivity = sessionStorage.getItem("buyfest_last_activity");
        if (savedLastActivity) {
          storedLastActivity = parseInt(savedLastActivity, 10);
        }
      } catch (e) { }

      if (now - storedLastActivity > 5 * 60 * 1000) {
        logout();
      }
    }, 5000);

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
      clearInterval(interval);
    };
  }, [user, logout]);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
