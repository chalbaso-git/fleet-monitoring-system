import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AlertApiService from '../../../services/api/alert';
import { Alert } from '../../../types/entities/alert';

// Query keys
const ALERT_KEYS = {
  all: ['alerts'] as const,
  lists: () => [...ALERT_KEYS.all, 'list'] as const,
};

/**
 * Hook to fetch all alerts
 * Uses GET /api/alert
 */
export const useGetAlerts = () => {
  return useQuery({
    queryKey: ALERT_KEYS.lists(),
    queryFn: AlertApiService.getAlerts,
    staleTime: 30000, // 30 seconds
  });
};

/**
 * Hook to add a new alert
 * Uses POST /api/alert
 */
export const useAddAlert = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (alert: Alert) => AlertApiService.addAlert(alert),
    onSuccess: () => {
      // Invalidate alerts query to refetch data
      queryClient.invalidateQueries({ queryKey: ALERT_KEYS.lists() });
    },
    onError: (error) => {
      console.error('Error adding alert:', error);
    },
  });
};
