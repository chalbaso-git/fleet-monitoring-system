// Route hooks exports
export * from './useRoute';
export * from './queryKeys';

// Re-export common hook patterns for convenience
export {
  useRoutes,
  useRoute,
  useRoutesByVehicle,
  useRoutesByVehicleAndDate,
  useRecentRoutes,
  useRouteAnalytics,
  useRoutePerformance,
  useRouteTemplates,
  useAddRoute,
  useCreateRoute,
  useUpdateRoute,
  useDeleteRoute,
  useOptimizeRoute,
  useValidateRoute,
  useExportRoutes,
  useCreateRouteTemplate,
} from './useRoute';

export {
  ROUTE_QUERY_KEYS,
  RouteQueryUtils,
} from './queryKeys';
