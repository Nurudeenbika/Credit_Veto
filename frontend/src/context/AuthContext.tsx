"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  UserRole,
} from "../lib/types";
import { AuthManager } from "../lib/auth";
import { apiClient } from "../lib/api";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  regenerateToken: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        setIsLoading(true);

        // Check if user has valid tokens
        if (AuthManager.isAuthenticated() && !AuthManager.isTokenExpired()) {
          // Try to get user data from localStorage first
          const storedUser = AuthManager.getUser();
          if (storedUser) {
            setUser(storedUser);
            setIsAuthenticated(true);
          } else {
            // Fetch fresh user data if not in localStorage
            await refreshProfile();
          }
        } else {
          // Clear invalid tokens
          AuthManager.clearTokens();
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        AuthManager.clearTokens();
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginRequest): Promise<void> => {
    try {
      setIsLoading(true);
      const authResponse: AuthResponse = await apiClient.login(credentials);

      // Tokens are already stored by the API client
      setUser(authResponse.user);
      setIsAuthenticated(true);
      AuthManager.setUser(authResponse.user);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterRequest): Promise<void> => {
    try {
      setIsLoading(true);
      const authResponse: AuthResponse = await apiClient.register(userData);

      // Tokens are already stored by the API client
      setUser(authResponse.user);
      setIsAuthenticated(true);
      AuthManager.setUser(authResponse.user);
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    AuthManager.logout();
    setUser(null);
    setIsAuthenticated(false);

    // Redirect will be handled by AuthManager.logout()
  };

  const refreshProfile = async (): Promise<void> => {
    try {
      if (!AuthManager.isAuthenticated()) {
        throw new Error("Not authenticated");
      }

      const userData = await apiClient.getProfile();
      setUser(userData);
      setIsAuthenticated(true);
      AuthManager.setUser(userData);
    } catch (error) {
      console.error("Error refreshing profile:", error);
      // Don't logout on profile refresh error - might be temporary network issue
      throw error;
    }
  };

  const hasRole = (role: UserRole | UserRole[]): boolean => {
    if (!user) return false;

    if (Array.isArray(role)) {
      return role.includes(user.role);
    }

    return user.role === role;
  };

  const regenerateToken = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await apiClient.regenerateToken();
      // Token is already stored by the API client
    } catch (error) {
      console.error("Token regeneration error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshProfile,
    hasRole,
    regenerateToken,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Higher-order component for protecting routes
export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  requiredRole?: UserRole | UserRole[]
) {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, isLoading, hasRole } = useAuth();

    useEffect(() => {
      if (!isLoading) {
        if (!isAuthenticated) {
          window.location.href = "/login";
          return;
        }

        if (requiredRole && !hasRole(requiredRole)) {
          window.location.href = "/dashboard";
          return;
        }
      }
    }, [isAuthenticated, isLoading]);

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return null; // Will redirect in useEffect
    }

    if (requiredRole && !hasRole(requiredRole)) {
      return null; // Will redirect in useEffect
    }

    return <WrappedComponent {...props} />;
  };
}
