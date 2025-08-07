import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import Cookies from "js-cookie";
import {
  ApiResponse,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
  CreditProfile,
  Dispute,
  CreateDisputeRequest,
  UpdateDisputeRequest,
  GenerateLetterRequest,
  GenerateLetterResponse,
  DashboardStats,
  PaginatedResponse,
} from "./types";

class ApiClient {
  private client: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true, // Include cookies in requests
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = Cookies.get("accessToken");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = Cookies.get("refreshToken");
            if (refreshToken) {
              const response = await this.refreshToken();
              const { accessToken } = response.data.tokens;

              Cookies.set("accessToken", accessToken);
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;

              return this.client(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, redirect to login
            this.logout();
            if (typeof window !== "undefined") {
              window.location.href = "/login";
            }
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private handleResponse<T>(response: AxiosResponse<ApiResponse<T>>): T {
    if (response.data.success) {
      return response.data.data!;
    }
    throw new Error(response.data.error || "Unknown error occurred");
  }

  private handleError(error: AxiosError): never {
    if (error.response?.data) {
      const apiError = error.response.data as ApiResponse;
      throw new Error(
        apiError.error || apiError.message || "Unknown error occurred"
      );
    }
    throw new Error(error.message || "Network error occurred");
  }

  // Authentication endpoints
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await this.client.post<ApiResponse<AuthResponse>>(
        "/auth/login",
        credentials
      );
      const authData = this.handleResponse(response);

      // Store tokens in cookies
      Cookies.set("accessToken", authData.tokens.accessToken, { expires: 1 }); // 1 day
      Cookies.set("refreshToken", authData.tokens.refreshToken, {
        expires: 30,
      }); // 30 days

      return authData;
    } catch (error) {
      this.handleError(error as AxiosError);
    }
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await this.client.post<ApiResponse<AuthResponse>>(
        "/auth/register",
        userData
      );
      const authData = this.handleResponse(response);

      // Store tokens in cookies
      Cookies.set("accessToken", authData.tokens.accessToken, { expires: 1 });
      Cookies.set("refreshToken", authData.tokens.refreshToken, {
        expires: 30,
      });

      return authData;
    } catch (error) {
      this.handleError(error as AxiosError);
    }
  }

  async refreshToken(): Promise<
    ApiResponse<{ tokens: { accessToken: string; refreshToken: string } }>
  > {
    try {
      const refreshToken = Cookies.get("refreshToken");
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await this.client.post<
        ApiResponse<{ tokens: { accessToken: string; refreshToken: string } }>
      >("/auth/refresh", {
        refreshToken,
      });

      return response.data;
    } catch (error) {
      this.handleError(error as AxiosError);
    }
  }

  async regenerateToken(): Promise<{ accessToken: string }> {
    try {
      const response = await this.client.post<
        ApiResponse<{ accessToken: string }>
      >("/auth/regenerate-token");
      const data = this.handleResponse(response);

      Cookies.set("accessToken", data.accessToken, { expires: 1 });

      return data;
    } catch (error) {
      this.handleError(error as AxiosError);
    }
  }

  logout(): void {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
  }

  // User endpoints
  async getProfile(): Promise<User> {
    try {
      const response = await this.client.get<ApiResponse<User>>(
        "/user/profile"
      );
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error as AxiosError);
    }
  }

  async updateProfile(userData: Partial<User>): Promise<User> {
    try {
      const response = await this.client.put<ApiResponse<User>>(
        "/user/profile",
        userData
      );
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error as AxiosError);
    }
  }

  // Credit Profile endpoints
  async getCreditProfile(userId: string): Promise<CreditProfile> {
    try {
      const response = await this.client.get<ApiResponse<CreditProfile>>(
        `/credit-profile/${userId}`
      );
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error as AxiosError);
    }
  }

  async refreshCreditProfile(userId: string): Promise<CreditProfile> {
    try {
      const response = await this.client.post<ApiResponse<CreditProfile>>(
        `/credit-profile/${userId}/refresh`
      );
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error as AxiosError);
    }
  }

  // Dispute endpoints
  async createDispute(disputeData: CreateDisputeRequest): Promise<Dispute> {
    try {
      const response = await this.client.post<ApiResponse<Dispute>>(
        "/disputes/create",
        disputeData
      );
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error as AxiosError);
    }
  }

  async getDisputeHistory(
    page = 1,
    limit = 10
  ): Promise<PaginatedResponse<Dispute>> {
    try {
      const response = await this.client.get<
        ApiResponse<PaginatedResponse<Dispute>>
      >(`/disputes/history?page=${page}&limit=${limit}`);
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error as AxiosError);
    }
  }

  async getDispute(disputeId: string): Promise<Dispute> {
    try {
      const response = await this.client.get<ApiResponse<Dispute>>(
        `/disputes/${disputeId}`
      );
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error as AxiosError);
    }
  }

  async updateDisputeStatus(
    disputeId: string,
    updateData: UpdateDisputeRequest
  ): Promise<Dispute> {
    try {
      const response = await this.client.put<ApiResponse<Dispute>>(
        `/disputes/${disputeId}/status`,
        updateData
      );
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error as AxiosError);
    }
  }

  // Admin endpoints
  async getAllDisputes(
    page = 1,
    limit = 10,
    status?: string
  ): Promise<PaginatedResponse<Dispute>> {
    try {
      let url = `/admin/disputes?page=${page}&limit=${limit}`;
      if (status) {
        url += `&status=${status}`;
      }

      const response = await this.client.get<
        ApiResponse<PaginatedResponse<Dispute>>
      >(url);
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error as AxiosError);
    }
  }

  async getAllUsers(page = 1, limit = 10): Promise<PaginatedResponse<User>> {
    try {
      const response = await this.client.get<
        ApiResponse<PaginatedResponse<User>>
      >(`/admin/users?page=${page}&limit=${limit}`);
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error as AxiosError);
    }
  }

  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await this.client.get<ApiResponse<DashboardStats>>(
        "/dashboard/stats"
      );
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error as AxiosError);
    }
  }

  // AI endpoints
  async generateDisputeLetter(
    requestData: GenerateLetterRequest
  ): Promise<GenerateLetterResponse> {
    try {
      const response = await this.client.post<
        ApiResponse<GenerateLetterResponse>
      >("/ai/generate-letter", requestData);
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error as AxiosError);
    }
  }

  // File upload endpoint
  async uploadFile(file: File): Promise<{ url: string; filename: string }> {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await this.client.post<
        ApiResponse<{ url: string; filename: string }>
      >("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error as AxiosError);
    }
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    try {
      const response = await this.client.get<
        ApiResponse<{ status: string; timestamp: string }>
      >("/health");
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error as AxiosError);
    }
  }
}

// Create and export a singleton instance
export const apiClient = new ApiClient();
export default apiClient;
