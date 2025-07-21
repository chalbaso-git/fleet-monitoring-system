import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AlertApiService } from '../../services/api/alert';
import { Alert } from '../../types/entities/alert';

// Query keys for React Query
export const ALERT_QUERY_KEYS = {
  all: ['alerts'] as const,
  lists: () => [...ALERT_QUERY_KEYS.all, 'list'] as const,
};

/**
 * Hook to fetch all alerts
 */
export const useAlerts = () => {
  return useQuery({
    queryKey: ALERT_QUERY_KEYS.lists(),
    queryFn: AlertApiService.getAlerts,
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute
    refetchIntervalInBackground: true,
  });
};

/**
 * Hook to add a new alert
 */
export const useAddAlert = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (alertData: { vehicleId: string; type: string; message: string }) => 
      AlertApiService.addAlert(alertData),
    onSuccess: (data, variables) => {
      // Invalidate and refetch alerts
      queryClient.invalidateQueries({ queryKey: ALERT_QUERY_KEYS.all });
      
      // Show success notification
      console.log('Alert added successfully:', data);
    },
    onError: (error) => {
      console.error('Failed to add alert:', error);
    },
  });
};

/**
 * Hook to get basic alert statistics
 */
export const useAlertStats = () => {
  const { data: alerts } = useAlerts();

  if (!alerts) {
    return {
      total: 0,
      byType: {},
    };
  }

  const stats = alerts.reduce((acc, alert) => {
    // Count by type
    acc.byType[alert.type] = (acc.byType[alert.type] || 0) + 1;
    
    return acc;
  }, {
    total: alerts.length,
    byType: {} as Record<string, number>,
  });

  return stats;
};
