
import { QueryClient } from '@tanstack/react-query';

// Create a client with performance optimizations for instant loading
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity, // Cache forever for local data
      gcTime: Infinity, // Keep in cache forever
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: 0, // No retries for instant loading
    },
  },
});

// Utility to invalidate queries by prefix
export const invalidateQueries = (prefix: string) => {
  return queryClient.invalidateQueries({ queryKey: [prefix] });
};

// Utility to prefetch common data
export const prefetchCommonData = async () => {
  // This function can be used to prefetch commonly used data
  // like events or user profile when the app initializes
};
