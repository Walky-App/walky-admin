import { QueryClient } from "@tanstack/react-query";

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors except 408 (timeout)
        if (error instanceof Error && "response" in error) {
          const axiosError = error as { response?: { status?: number } };
          const status = axiosError.response?.status;
          if (status && status >= 400 && status < 500 && status !== 408) {
            return false;
          }
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Query keys factory
export const queryKeys = {
  campuses: ["campuses"] as const,
  campus: (id: string) => ["campus", id] as const,
  students: ["students"] as const,
  geofences: (campusId: string) => ["geofences", campusId] as const,
  ambassadors: ["ambassadors"] as const,
  ambassador: (id: string) => ["ambassador", id] as const,
  ambassadorsByCampus: (campusId: string) =>
    ["ambassadors", "campus", campusId] as const,
} as const;
