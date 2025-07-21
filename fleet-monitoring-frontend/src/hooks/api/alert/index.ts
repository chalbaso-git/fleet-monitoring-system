import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AlertApiService } from '@/services/api/alert';
import { Alert } from '@/types/entities/alert';
import { CreateAlertRequest } from '@/types/requests/alert';
import { AlertFilters } from '@/types/responses/alert';
import { AlertSeverity } from '@/types/enums';
import { formatRelativeDate, isWithinLastMinutes } from '@/utils';

// Query keys for React Query
export const ALERT_QUERY_KEYS = {
  all: ['alerts'] as const,
  lists: () => [...ALERT_QUERY_KEYS.all, 'list'] as const,
  list: (filters: AlertFilters) => [...ALERT_QUERY_KEYS.lists(), filters] as const,
  vehicle: (vehicleId: string) => [...ALERT_QUERY_KEYS.all, 'vehicle', vehicleId] as const,
  recent: () => [...ALERT_QUERY_KEYS.all, 'recent'] as const,
  critical: () => [...ALERT_QUERY_KEYS.all, 'critical'] as const,
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
 * Hook to fetch alerts with filters
 */
export const useFilteredAlerts = (filters: AlertFilters) => {
  return useQuery({
    queryKey: ALERT_QUERY_KEYS.list(filters),
    queryFn: () => AlertApiService.getFilteredAlerts(filters),
    enabled: Object.keys(filters).length > 0,
    staleTime: 30000,
  });
};

/**
 * Hook to fetch alerts for a specific vehicle
 */
export const useVehicleAlerts = (vehicleId: string) => {
  return useQuery({
    queryKey: ALERT_QUERY_KEYS.vehicle(vehicleId),
    queryFn: () => AlertApiService.getVehicleAlerts(vehicleId),
    enabled: !!vehicleId,
    staleTime: 30000,
    refetchInterval: 60000,
  });
};

/**
 * Hook to fetch recent alerts (last 24 hours)
 */
export const useRecentAlerts = () => {
  return useQuery({
    queryKey: ALERT_QUERY_KEYS.recent(),
    queryFn: AlertApiService.getRecentAlerts,
    staleTime: 30000,
    refetchInterval: 60000,
  });
};

/**
 * Hook to fetch critical alerts
 */
export const useCriticalAlerts = () => {
  return useQuery({
    queryKey: ALERT_QUERY_KEYS.critical(),
    queryFn: AlertApiService.getCriticalAlerts,
    staleTime: 15000, // 15 seconds - more frequent for critical alerts
    refetchInterval: 30000, // Refetch every 30 seconds
    refetchIntervalInBackground: true,
  });
};

/**
 * Hook to add a new alert
 */
export const useAddAlert = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (alertData: CreateAlertRequest) => AlertApiService.addAlert(alertData),
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
 * Hook to get alert statistics
 */
export const useAlertStats = () => {
  const { data: alerts } = useAlerts();

  if (!alerts) {
    return {
      total: 0,
      byType: {},
      bySeverity: {},
      recentCount: 0,
    };
  }

  const stats = alerts.reduce((acc, alert) => {
    // Count by type
    acc.byType[alert.type] = (acc.byType[alert.type] || 0) + 1;
    
    // Count by severity
    const severity = getAlertSeverity(alert.type);
    acc.bySeverity[severity] = (acc.bySeverity[severity] || 0) + 1;
    
    // Count recent alerts (last hour)
    if (isWithinLastMinutes(alert.createdAt, 60)) {
      acc.recentCount++;
    }
    
    return acc;
  }, {
    total: alerts.length,
    byType: {} as Record<string, number>,
    bySeverity: {} as Record<AlertSeverity, number>,
    recentCount: 0,
  });

  return stats;
};

/**
 * Utility function to determine alert severity based on type
 */
function getAlertSeverity(alertType: string): AlertSeverity {
  const severityMap: Record<string, AlertSeverity> = {
    gps_failure: AlertSeverity.HIGH,
    route_deviation: AlertSeverity.MEDIUM,
    circuit_breaker: AlertSeverity.CRITICAL,
    network_error: AlertSeverity.HIGH,
    system_error: AlertSeverity.CRITICAL,
    maintenance_required: AlertSeverity.MEDIUM,
    speed_violation: AlertSeverity.HIGH,
    geofence_violation: AlertSeverity.MEDIUM,
    engine_warning: AlertSeverity.CRITICAL,
    fuel_low: AlertSeverity.LOW,
  };

  return severityMap[alertType] || AlertSeverity.MEDIUM;
}

// Export specialized hooks
export * from './analytics';
export * from './mutations';
