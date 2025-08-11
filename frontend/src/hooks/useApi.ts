import { useState, useCallback } from "react";
import { apiClient } from "../lib/api";

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiReturn<T, Args extends unknown[] = any[]>
  extends UseApiState<T> {
  execute: (...args: Args) => Promise<T>;
  reset: () => void;
}

export function useApi<T = any, Args extends unknown[] = any[]>(
  apiFunction: (...args: Args) => Promise<T>,
  immediate = false
): UseApiReturn<T, Args> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: immediate,
    error: null,
  });

  const execute = useCallback(
    async (...args: Args): Promise<T> => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const result = await apiFunction(...args);
        setState({ data: result, loading: false, error: null });
        return result;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "An error occurred";
        setState((prev) => ({ ...prev, loading: false, error: errorMessage }));
        throw error;
      }
    },
    [apiFunction]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

// Specific API hooks
export function useCreditProfile(userId?: string) {
  return useApi((id: string) => apiClient.getCreditProfile(id), false);
}

export function useDisputes() {
  return useApi(
    (page = 1, limit = 10) => apiClient.getDisputeHistory(page, limit),
    false
  );
}

export function useCreateDispute() {
  return useApi(apiClient.createDispute, false);
}

export function useUpdateDisputeStatus() {
  return useApi(
    (disputeId: string, updateData: any) =>
      apiClient.updateDisputeStatus(disputeId, updateData),
    false
  );
}

export function useGenerateDisputeLetter() {
  return useApi(apiClient.generateDisputeLetter, false);
}

export function useDashboardStats() {
  return useApi(apiClient.getDashboardStats, false);
}

export function useAllDisputes() {
  return useApi(
    (page = 1, limit = 10, status?: string) =>
      apiClient.getAllDisputes(page, limit, status),
    false
  );
}

export function useAllUsers() {
  return useApi(
    (page = 1, limit = 10) => apiClient.getAllUsers(page, limit),
    false
  );
}
