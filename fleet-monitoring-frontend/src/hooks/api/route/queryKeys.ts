/**
 * Query keys for route-related React Query operations
 */
export const ROUTE_QUERY_KEYS = {
  BASE: ['routes'] as const,
  
  // List queries
  ALL: ['routes', 'all'] as const,
  RECENT: (limit?: number) => ['routes', 'recent', { limit }] as const,
  BY_VEHICLE: (vehicleId: string, limit?: number) => 
    ['routes', 'by-vehicle', { vehicleId, limit }] as const,
  BY_VEHICLE_DATE: (vehicleId: string, startDate: string, endDate: string) =>
    ['routes', 'by-vehicle-date', { vehicleId, startDate, endDate }] as const,
  
  // Detail queries
  DETAIL: (routeId: string) => ['routes', 'detail', routeId] as const,
  PERFORMANCE: (routeId: string) => ['routes', 'performance', routeId] as const,
  
  // Analytics queries
  ANALYTICS: (startDate: string, endDate: string, vehicleId?: string) =>
    ['routes', 'analytics', { startDate, endDate, vehicleId }] as const,
  
  // Template queries
  TEMPLATES: ['routes', 'templates'] as const,
  
  // Utility queries
  VALIDATION: (path: string, vehicleId: string) =>
    ['routes', 'validation', { path, vehicleId }] as const,
} as const;

/**
 * Helper functions for query key management
 */
export const RouteQueryUtils = {
  /**
   * Get all route-related query keys
   */
  getAllKeys: () => ROUTE_QUERY_KEYS.BASE,
  
  /**
   * Get all keys for a specific vehicle
   */
  getVehicleKeys: (vehicleId: string) => 
    ['routes', 'by-vehicle', { vehicleId }] as const,
  
  /**
   * Get all analytics keys
   */
  getAnalyticsKeys: () => ['routes', 'analytics'] as const,
  
  /**
   * Get all template keys
   */
  getTemplateKeys: () => ROUTE_QUERY_KEYS.TEMPLATES,
  
  /**
   * Check if a query key is route-related
   */
  isRouteKey: (queryKey: unknown[]): boolean => {
    return Array.isArray(queryKey) && queryKey[0] === 'routes';
  },
  
  /**
   * Extract vehicle ID from a route query key if present
   */
  extractVehicleId: (queryKey: unknown[]): string | undefined => {
    if (!RouteQueryUtils.isRouteKey(queryKey)) return undefined;
    
    if (queryKey.length >= 3 && typeof queryKey[2] === 'object') {
      const params = queryKey[2] as any;
      return params?.vehicleId;
    }
    
    return undefined;
  },
  
  /**
   * Check if a query key represents a list query
   */
  isListQuery: (queryKey: unknown[]): boolean => {
    if (!RouteQueryUtils.isRouteKey(queryKey)) return false;
    
    const listTypes = ['all', 'recent', 'by-vehicle', 'by-vehicle-date', 'templates'];
    return queryKey.length >= 2 && listTypes.includes(queryKey[1] as string);
  },
  
  /**
   * Check if a query key represents a detail query
   */
  isDetailQuery: (queryKey: unknown[]): boolean => {
    if (!RouteQueryUtils.isRouteKey(queryKey)) return false;
    
    const detailTypes = ['detail', 'performance'];
    return queryKey.length >= 2 && detailTypes.includes(queryKey[1] as string);
  },
} as const;
