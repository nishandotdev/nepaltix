
import { QueryClient } from '@tanstack/react-query';

// Create a client with performance optimizations
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000, // 1 minute
      gcTime: 300000, // 5 minutes (formerly cacheTime)
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: true,
      retry: 1,
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
