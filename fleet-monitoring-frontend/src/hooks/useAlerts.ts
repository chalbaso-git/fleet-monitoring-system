import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AlertApiService } from '../services/api/alert';

// Basic types for alerts
export interface Alert {
  id: string;
  vehicleId: string;
  type: string;
  severity: string;
  message: string;
  createdAt: string;
}

export interface CreateAlertRequest {
  vehicleId: string;
  type: string;
  severity: string;
  message: string;
}

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
    queryKey: ALERT_QUERY_KEYS.all,
    queryFn: AlertApiService.getAlerts,
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // 1 minute
  });
};

/**
 * Hook to add a new alert
 */
export const useAddAlert = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (alertData: CreateAlertRequest) => AlertApiService.addAlert(alertData),
    onSuccess: () => {
      // Invalidate and refetch alerts after successful creation
      queryClient.invalidateQueries({ queryKey: ALERT_QUERY_KEYS.all });
    },
    onError: (error) => {
      console.error('Error adding alert:', error);
    },
  });
};

/**
 * Hook to get basic alert statistics
 */
export const useAlertStats = () => {
  const { data: alerts } = useAlerts();

  if (!alerts || !Array.isArray(alerts)) {
    return {
      total: 0,
      byType: {},
      bySeverity: {},
    };
  }

  const stats = alerts.reduce((acc: any, alert: any) => {
    // Count by type
    acc.byType[alert.type] = (acc.byType[alert.type] || 0) + 1;
    
    // Count by severity
    acc.bySeverity[alert.severity] = (acc.bySeverity[alert.severity] || 0) + 1;
    
    return acc;
  }, {
    total: alerts.length,
    byType: {} as Record<string, number>,
    bySeverity: {} as Record<string, number>,
  });

  return stats;
};
