import { useQuery } from '@tanstack/react-query';
import { AlertApiService } from '../../../services/api/alert';
import { AlertAnalyticsService } from '../../../services/api/alert/analytics';
import { Alert } from '../../../types/entities/alert';
import { AlertDashboardStats, AlertSummary } from '../../../types/responses/alert/analytics';

// Query keys específicos para analytics
export const ALERT_ANALYTICS_QUERY_KEYS = {
  dashboard: ['alerts', 'analytics', 'dashboard'] as const,
  summary: ['alerts', 'analytics', 'summary'] as const,
  enhanced: (alertId: number) => ['alerts', 'analytics', 'enhanced', alertId] as const,
};

/**
 * Hook to get dashboard analytics
 */
export const useAlertDashboard = () => {
  return useQuery({
    queryKey: ALERT_ANALYTICS_QUERY_KEYS.dashboard,
    queryFn: async (): Promise<AlertDashboardStats> => {
      const alerts = await AlertApiService.getAlerts();
      
      // Calculate dashboard stats
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const alertsToday = alerts.filter(alert => 
        new Date(alert.createdAt) >= today
      );
      
      const criticalAlerts = alerts.filter(alert => 
        AlertAnalyticsService.getSeverity(alert.type) === 'critical'
      );
      
      // Mock additional analytics data
      return {
        totalAlerts: alerts.length,
        alertsToday: alertsToday.length,
        criticalAlerts: criticalAlerts.length,
        resolvedToday: Math.floor(alertsToday.length * 0.8), // 80% resolved
        averageResolutionTime: 25, // 25 minutes average
        
        trendsLastWeek: Array.from({ length: 7 }).map((_, i) => {
          const day = new Date(today);
          day.setDate(today.getDate() - i);
          day.setHours(0, 0, 0, 0);
          const nextDay = new Date(day);
          nextDay.setDate(day.getDate() + 1);
          const count = alerts.filter(alert => {
            const createdAt = new Date(alert.createdAt);
            return createdAt >= day && createdAt < nextDay;
          }).length;
          return {
            date: day.toISOString().slice(0, 10),
            count,
          };
        }).reverse(), // Trends for the last 7 days (oldest to newest)
        alertsByType: [], // TODO: Implement type breakdown
        alertsBySeverity: [], // TODO: Implement severity breakdown
      };
    },
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // 1 minute
  });
};

/**
 * Hook to get alert summary for notifications
 */
export const useAlertSummary = () => {
  return useQuery({
    queryKey: ALERT_ANALYTICS_QUERY_KEYS.summary,
    queryFn: async (): Promise<AlertSummary> => {
      const alerts = await AlertApiService.getAlerts();
      const recentAlerts = await AlertApiService.getRecentAlerts();
      const criticalAlerts = await AlertApiService.getCriticalAlerts();
      
      const lastAlert = alerts.length > 0 ? alerts[0] : undefined;
      
      return {
        totalUnread: recentAlerts.length,
        criticalUnread: criticalAlerts.length,
        lastAlert: lastAlert ? {
          id: lastAlert.id,
          type: lastAlert.type,
          vehicleId: lastAlert.vehicleId,
          createdAt: lastAlert.createdAt,
        } : undefined,
      };
    },
    staleTime: 15000, // 15 seconds
    refetchInterval: 30000, // 30 seconds
  });
};

/**
 * Hook to get enhanced alert with analytics
 */
export const useEnhancedAlert = (alert: Alert | null) => {
  return useQuery({
    queryKey: alert ? ALERT_ANALYTICS_QUERY_KEYS.enhanced(alert.id) : [],
    queryFn: () => {
      if (!alert) return null;
      return AlertAnalyticsService.enhanceAlert(alert);
    },
    enabled: !!alert,
    staleTime: 300000, // 5 minutes (analytics don't change often)
  });
};

/**
 * Hook to get real-time alert metrics
 */
export const useAlertMetrics = () => {
  const { data: dashboard } = useAlertDashboard();
  const { data: summary } = useAlertSummary();
  
  return {
    dashboard,
    summary,
    isLoading: !dashboard || !summary,
    hasUnreadAlerts: (summary?.totalUnread || 0) > 0,
    hasCriticalAlerts: (summary?.criticalUnread || 0) > 0,
  };
};
