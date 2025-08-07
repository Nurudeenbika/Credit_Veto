import Cookies from "js-cookie";
import { User, UserRole } from "./types";

export class AuthManager {
  private static readonly ACCESS_TOKEN_KEY = "accessToken";
  private static readonly REFRESH_TOKEN_KEY = "refreshToken";
  private static readonly USER_KEY = "user";

  static isAuthenticated(): boolean {
    return !!Cookies.get(this.ACCESS_TOKEN_KEY);
  }

  static getAccessToken(): string | undefined {
    return Cookies.get(this.ACCESS_TOKEN_KEY);
  }

  static getRefreshToken(): string | undefined {
    return Cookies.get(this.REFRESH_TOKEN_KEY);
  }

  static setTokens(accessToken: string, refreshToken: string): void {
    Cookies.set(this.ACCESS_TOKEN_KEY, accessToken, {
      expires: 1,
      secure: false,
      sameSite: "lax",
    });
    Cookies.set(this.REFRESH_TOKEN_KEY, refreshToken, {
      expires: 30,
      secure: false,
      sameSite: "lax",
    });
  }

  static clearTokens(): void {
    Cookies.remove(this.ACCESS_TOKEN_KEY);
    Cookies.remove(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  static setUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  static getUser(): User | null {
    if (typeof window === "undefined") return null;

    const userStr = localStorage.getItem(this.USER_KEY);
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error("Error parsing user data:", error);
      localStorage.removeItem(this.USER_KEY);
      return null;
    }
  }

  static getUserRole(): UserRole | null {
    const user = this.getUser();
    return user?.role || null;
  }

  static hasRole(requiredRole: UserRole | UserRole[]): boolean {
    const userRole = this.getUserRole();
    if (!userRole) return false;

    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(userRole);
    }

    return userRole === requiredRole;
  }

  static isAdmin(): boolean {
    return this.hasRole("admin");
  }

  static isUser(): boolean {
    return this.hasRole("user");
  }

  static logout(): void {
    this.clearTokens();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }

  static getAuthHeaders(): Record<string, string> {
    const token = this.getAccessToken();
    if (!token) return {};

    return {
      Authorization: `Bearer ${token}`,
    };
  }

  static decodeToken(token: string): any {
    try {
      // Simple JWT decode (without verification - this should be done server-side)
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  }

  static isTokenExpired(token?: string): boolean {
    const tokenToCheck = token || this.getAccessToken();
    if (!tokenToCheck) return true;

    const decoded = this.decodeToken(tokenToCheck);
    if (!decoded || !decoded.exp) return true;

    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  }

  static getTokenExpirationTime(token?: string): Date | null {
    const tokenToCheck = token || this.getAccessToken();
    if (!tokenToCheck) return null;

    const decoded = this.decodeToken(tokenToCheck);
    if (!decoded || !decoded.exp) return null;

    return new Date(decoded.exp * 1000);
  }
}

// Utility functions for route protection
export const requireAuth = (): boolean => {
  return AuthManager.isAuthenticated() && !AuthManager.isTokenExpired();
};

export const requireRole = (role: UserRole | UserRole[]): boolean => {
  return requireAuth() && AuthManager.hasRole(role);
};

export const redirectIfNotAuth = (redirectTo = "/login"): boolean => {
  if (!requireAuth()) {
    if (typeof window !== "undefined") {
      window.location.href = redirectTo;
    }
    return false;
  }
  return true;
};

export const redirectIfNotRole = (
  role: UserRole | UserRole[],
  redirectTo = "/dashboard"
): boolean => {
  if (!requireRole(role)) {
    if (typeof window !== "undefined") {
      window.location.href = redirectTo;
    }
    return false;
  }
  return true;
};

// Export the class as default
export default AuthManager;
