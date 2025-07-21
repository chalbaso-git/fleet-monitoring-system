/**
 * React Query keys for routing API
 */
export const routingQueryKeys = {
  all: ['routing'] as const,
  
  // Route Calculation Keys
  calculations: () => [...routingQueryKeys.all, 'calculations'] as const,
  calculation: (requestId: string) => [...routingQueryKeys.calculations(), requestId] as const,
  
  // Route Optimization Keys
  optimizations: () => [...routingQueryKeys.all, 'optimizations'] as const,
  optimization: (requestId: string) => [...routingQueryKeys.optimizations(), requestId] as const,
  
  // Batch Calculations Keys
  batches: () => [...routingQueryKeys.all, 'batches'] as const,
  batch: (batchId: string) => [...routingQueryKeys.batches(), batchId] as const,
  
  // Circuit Breaker Keys
  circuitBreaker: () => [...routingQueryKeys.all, 'circuit-breaker'] as const,
  circuitBreakerStatus: () => [...routingQueryKeys.circuitBreaker(), 'status'] as const,
  
  // Cache Keys
  cache: () => [...routingQueryKeys.all, 'cache'] as const,
  cacheStatus: () => [...routingQueryKeys.cache(), 'status'] as const,
  cacheStatistics: () => [...routingQueryKeys.cache(), 'statistics'] as const,
  
  // Zone Lock Keys
  locks: () => [...routingQueryKeys.all, 'locks'] as const,
  lock: (zoneId: string) => [...routingQueryKeys.locks(), zoneId] as const,
  lockStatus: (zoneId: string) => [...routingQueryKeys.lock(zoneId), 'status'] as const,
  
  // Analytics Keys
  analytics: () => [...routingQueryKeys.all, 'analytics'] as const,
  routingAnalytics: (filters: Record<string, any>) => 
    [...routingQueryKeys.analytics(), 'routing', filters] as const,
  performanceAnalytics: (filters: Record<string, any>) => 
    [...routingQueryKeys.analytics(), 'performance', filters] as const,
  
  // Algorithm Keys
  algorithms: () => [...routingQueryKeys.all, 'algorithms'] as const,
  algorithmList: () => [...routingQueryKeys.algorithms(), 'list'] as const,
  algorithmComparison: (params: Record<string, any>) => 
    [...routingQueryKeys.algorithms(), 'comparison', params] as const,
  algorithmConfigurations: () => [...routingQueryKeys.algorithms(), 'configurations'] as const,
  
  // System Health Keys
  health: () => [...routingQueryKeys.all, 'health'] as const,
  healthStatus: () => [...routingQueryKeys.health(), 'status'] as const,
  systemMetrics: () => [...routingQueryKeys.health(), 'metrics'] as const,
  
  // Audit Keys
  audit: () => [...routingQueryKeys.all, 'audit'] as const,
  auditLogs: (filters: Record<string, any>) => 
    [...routingQueryKeys.audit(), 'logs', filters] as const,
  auditExports: () => [...routingQueryKeys.audit(), 'exports'] as const,
  
  // Validation Keys
  validation: () => [...routingQueryKeys.all, 'validation'] as const,
  routeValidation: (requestHash: string) => 
    [...routingQueryKeys.validation(), 'route', requestHash] as const,
} as const;
