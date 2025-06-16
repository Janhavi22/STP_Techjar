// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export type UserRole = "operator" | "admin";

export interface User {
  id: string;
  username: string;
  role: UserRole;
  siteId?: string;
  siteName?: string;
  name?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (username: string, password: string, siteId?: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  sites: { site_id: string; site_name: string }[]; // changed from operatorSites
  setSites: React.Dispatch<
    React.SetStateAction<{ site_id: string; site_name: string }[]>
  >;
  requiresSiteSelection: boolean;
  setRequiresSiteSelection: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sites, setSites] = useState<{ site_id: string; site_name: string }[]>(
    []
  );
  const [requiresSiteSelection, setRequiresSiteSelection] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("aquaguard_user");
    const savedToken = localStorage.getItem("aquaguard_token");
    const savedSites = localStorage.getItem("aquaguard_sites"); // updated key name
    const savedRequiresSiteSelection = localStorage.getItem(
      "aquaguard_requires_site_selection"
    );

    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedToken) setToken(savedToken);
    if (savedSites) setSites(JSON.parse(savedSites));
    if (savedRequiresSiteSelection)
      setRequiresSiteSelection(savedRequiresSiteSelection === "true");
  }, []);

  const login = async (username: string, password: string, siteId?: string) => {
    setIsLoading(true);
    setRequiresSiteSelection(false);
    try {
      const formData = new URLSearchParams();
      formData.append("username", username);
      formData.append("password", password);
      if (siteId) formData.append("site_id", siteId);

      const res = await fetch("http://localhost:8000/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Login failed");
      }

      const data = await res.json();

      if (data.requires_site_selection) {
        // Operator login step 1 - get site list
        setSites(data.sites || []);
        localStorage.setItem("aquaguard_sites", JSON.stringify(data.sites));
        setRequiresSiteSelection(true);
        localStorage.setItem("aquaguard_requires_site_selection", "true");
      } else if (data.token) {
        // Successful login with token (admin or operator after site selected)
        setToken(data.token);
        const role = data.role || (siteId ? "operator" : "admin"); // fallback role guess
        const loggedInUser: User = { id: data.id, username, role, siteId };
        setUser(loggedInUser);
        localStorage.setItem("aquaguard_user", JSON.stringify(loggedInUser));
        localStorage.setItem("aquaguard_token", data.token);
        setSites([]);
        setRequiresSiteSelection(false);
        localStorage.removeItem("aquaguard_sites");
        localStorage.removeItem("aquaguard_requires_site_selection");

        if (role === "admin") navigate("/admin");
        else navigate("/operator");
      }
    } catch (error: any) {
      setSites([]);
      setRequiresSiteSelection(false);
      localStorage.removeItem("aquaguard_sites");
      localStorage.removeItem("aquaguard_requires_site_selection");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setSites([]);
    setRequiresSiteSelection(false);
    localStorage.removeItem("aquaguard_user");
    localStorage.removeItem("aquaguard_token");
    localStorage.removeItem("aquaguard_sites");
    localStorage.removeItem("aquaguard_requires_site_selection");
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user,
        sites,
        setSites,
        requiresSiteSelection,
        setRequiresSiteSelection,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
