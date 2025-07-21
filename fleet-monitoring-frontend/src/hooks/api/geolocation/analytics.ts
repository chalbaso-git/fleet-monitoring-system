import { useQuery } from '@tanstack/react-query';
import { GeolocationAnalyticsService } from '@/services/api/geolocation/analytics';
import { GEOLOCATION_QUERY_KEYS } from './index';

/**
 * Hook to get comprehensive vehicle analytics
 */
export const useVehicleAnalytics = (
  vehicleId: string,
  startDate: string,
  endDate: string
) => {
  return useQuery({
    queryKey: [...GEOLOCATION_QUERY_KEYS.analytics(), 'vehicle', vehicleId, startDate, endDate],
    queryFn: () => GeolocationAnalyticsService.getVehicleAnalytics(vehicleId, startDate, endDate),
    enabled: !!vehicleId && !!startDate && !!endDate,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to get fleet analytics
 */
export const useFleetAnalytics = (
  vehicleIds: string[],
  startDate: string,
  endDate: string
) => {
  return useQuery({
    queryKey: [...GEOLOCATION_QUERY_KEYS.analytics(), 'fleet', vehicleIds, startDate, endDate],
    queryFn: () => GeolocationAnalyticsService.getFleetAnalytics(vehicleIds, startDate, endDate),
    enabled: vehicleIds.length > 0 && !!startDate && !!endDate,
    staleTime: 15 * 60 * 1000, // 15 minutes - expensive computation
  });
};

/**
 * Hook to analyze route efficiency
 */
export const useRouteEfficiencyAnalysis = (
  vehicleId: string,
  startDate: string,
  endDate: string
) => {
  return useQuery({
    queryKey: [...GEOLOCATION_QUERY_KEYS.analytics(), 'route-efficiency', vehicleId, startDate, endDate],
    queryFn: () => GeolocationAnalyticsService.analyzeRouteEfficiency(vehicleId, startDate, endDate),
    enabled: !!vehicleId && !!startDate && !!endDate,
    staleTime: 10 * 60 * 1000,
  });
};

/**
 * Hook to get geofence compliance report
 */
export const useGeofenceComplianceReport = (
  geofenceIds: string[],
  startDate: string,
  endDate: string
) => {
  return useQuery({
    queryKey: [...GEOLOCATION_QUERY_KEYS.geofences(), 'compliance', geofenceIds, startDate, endDate],
    queryFn: () => GeolocationAnalyticsService.getGeofenceComplianceReport(geofenceIds, startDate, endDate),
    enabled: geofenceIds.length > 0 && !!startDate && !!endDate,
    staleTime: 10 * 60 * 1000,
  });
};

/**
 * Hook to identify vehicle behavior patterns
 */
export const useVehicleBehaviorPatterns = (
  vehicleId: string,
  startDate: string,
  endDate: string
) => {
  return useQuery({
    queryKey: [...GEOLOCATION_QUERY_KEYS.analytics(), 'behavior-patterns', vehicleId, startDate, endDate],
    queryFn: () => GeolocationAnalyticsService.identifyBehaviorPatterns(vehicleId, startDate, endDate),
    enabled: !!vehicleId && !!startDate && !!endDate,
    staleTime: 15 * 60 * 1000, // 15 minutes - complex analysis
  });
};

/**
 * Hook to get carbon footprint report
 */
export const useCarbonFootprintReport = (
  vehicleIds: string[],
  startDate: string,
  endDate: string
) => {
  return useQuery({
    queryKey: [...GEOLOCATION_QUERY_KEYS.analytics(), 'carbon-footprint', vehicleIds, startDate, endDate],
    queryFn: () => GeolocationAnalyticsService.getCarbonFootprintReport(vehicleIds, startDate, endDate),
    enabled: vehicleIds.length > 0 && !!startDate && !!endDate,
    staleTime: 15 * 60 * 1000,
  });
};
