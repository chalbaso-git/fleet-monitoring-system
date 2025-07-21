import apiClient from '../client';
import {
  CalculateRouteRequest,
  OptimizeRouteRequest,
  BatchRouteCalculationRequest,
  ConfigureCircuitBreakerRequest,
  ResetCircuitBreakerRequest,
  ClearRouteCacheRequest,
  ConfigureCacheRequest,
  AcquireZoneLockRequest,
  ReleaseZoneLockRequest,
  RoutingAnalyticsRequest,
  PerformanceAnalyticsRequest,
  ExportAuditLogsRequest,
  ValidateRouteRequestRequest,
  AlgorithmComparisonRequest,
  UpdateAlgorithmConfigRequest,
  SystemHealthCheckRequest,
} from '../../../types/requests/routing';
import {
  CalculateRouteResponse,
  OptimizeRouteResponse,
  BatchRouteCalculationResponse,
  CircuitBreakerResponse,
  RouteCacheResponse,
  ZoneLockResponse,
  RoutingAnalyticsResponse,
  PerformanceAnalyticsResponse,
  ExportAuditLogsResponse,
  ValidateRouteResponse,
  AlgorithmComparisonResponse,
  SystemHealthCheckResponse,
} from '../../../types/responses/routing';
import { CircuitBreakerState } from '../../../types/entities/routing';

/**
 * RoutingApiService - Handles all routing-related API calls with circuit breaker pattern
 */
export class RoutingApiService {
  private readonly baseUrl = '/api/routing';
  private circuitBreakerState: CircuitBreakerState | null = null;
  private failureCount = 0;
  private lastFailureTime: Date | null = null;
  private readonly FAILURE_THRESHOLD = 3;
  private readonly TIMEOUT_DURATION = 30000; // 30 seconds
  private readonly RESET_TIME_WINDOW = 60000; // 1 minute

  /**
   * Calculate a route between points
   */
  async calculateRoute(request: CalculateRouteRequest): Promise<CalculateRouteResponse> {
    if (this.isCircuitBreakerOpen()) {
      throw new Error('Routing service is temporarily unavailable due to circuit breaker');
    }

    try {
      const response = await this.executeWithCircuitBreaker(
        () => apiClient.post(`${this.baseUrl}/calculate`, request),
        request.maxCalculationTime || this.TIMEOUT_DURATION
      );

      this.onSuccess();
      return response.data as CalculateRouteResponse;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  /**
   * Optimize an existing route
   */
  async optimizeRoute(request: OptimizeRouteRequest): Promise<OptimizeRouteResponse> {
    if (this.isCircuitBreakerOpen()) {
      throw new Error('Routing service is temporarily unavailable due to circuit breaker');
    }

    try {
      const response = await this.executeWithCircuitBreaker(
        () => apiClient.post(`${this.baseUrl}/optimize`, request),
        request.maxOptimizationTime || this.TIMEOUT_DURATION
      );

      this.onSuccess();
      return response.data as OptimizeRouteResponse;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  /**
   * Calculate multiple routes in batch
   */
  async calculateBatchRoutes(request: BatchRouteCalculationRequest): Promise<BatchRouteCalculationResponse> {
    if (this.isCircuitBreakerOpen()) {
      throw new Error('Routing service is temporarily unavailable due to circuit breaker');
    }

    try {
      const response = await this.executeWithCircuitBreaker(
        () => apiClient.post(`${this.baseUrl}/batch`, request),
        60000 // 1 minute for batch operations
      );

      this.onSuccess();
      return response.data as BatchRouteCalculationResponse;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  /**
   * Get current circuit breaker status
   */
  async getCircuitBreakerStatus(): Promise<CircuitBreakerResponse> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/circuit-breaker/status`);
      return response.data as CircuitBreakerResponse;
    } catch (error) {
      // Don't affect circuit breaker state for status checks
      throw error;
    }
  }

  /**
   * Configure circuit breaker settings
   */
  async configureCircuitBreaker(request: ConfigureCircuitBreakerRequest): Promise<CircuitBreakerResponse> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/circuit-breaker/configure`, request);
      return response.data as CircuitBreakerResponse;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Reset circuit breaker
   */
  async resetCircuitBreaker(request: ResetCircuitBreakerRequest): Promise<CircuitBreakerResponse> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/circuit-breaker/reset`, request);
      
      // Reset local circuit breaker state if successful
      const result = response.data as CircuitBreakerResponse;
      if (result.success) {
        this.failureCount = 0;
        this.lastFailureTime = null;
        this.circuitBreakerState = null;
      }
      
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Clear route cache
   */
  async clearRouteCache(request: ClearRouteCacheRequest): Promise<RouteCacheResponse> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/cache/clear`, request);
      return response.data as RouteCacheResponse;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Configure cache settings
   */
  async configureCache(request: ConfigureCacheRequest): Promise<RouteCacheResponse> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/cache/configure`, request);
      return response.data as RouteCacheResponse;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get cache status and statistics
   */
  async getCacheStatus(): Promise<RouteCacheResponse> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/cache/status`);
      return response.data as RouteCacheResponse;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Acquire zone lock
   */
  async acquireZoneLock(request: AcquireZoneLockRequest): Promise<ZoneLockResponse> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/locks/acquire`, request);
      return response.data as ZoneLockResponse;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Release zone lock
   */
  async releaseZoneLock(request: ReleaseZoneLockRequest): Promise<ZoneLockResponse> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/locks/release`, request);
      return response.data as ZoneLockResponse;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get zone lock status
   */
  async getZoneLockStatus(zoneId: string): Promise<ZoneLockResponse> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/locks/status/${zoneId}`);
      return response.data as ZoneLockResponse;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get routing analytics
   */
  async getRoutingAnalytics(request: RoutingAnalyticsRequest): Promise<RoutingAnalyticsResponse> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/analytics/routing`, request);
      return response.data as RoutingAnalyticsResponse;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get performance analytics
   */
  async getPerformanceAnalytics(request: PerformanceAnalyticsRequest): Promise<PerformanceAnalyticsResponse> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/analytics/performance`, request);
      return response.data as PerformanceAnalyticsResponse;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Export audit logs
   */
  async exportAuditLogs(request: ExportAuditLogsRequest): Promise<ExportAuditLogsResponse> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/audit/export`, request);
      return response.data as ExportAuditLogsResponse;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Validate route request
   */
  async validateRouteRequest(request: ValidateRouteRequestRequest): Promise<ValidateRouteResponse> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/validate`, request);
      return response.data as ValidateRouteResponse;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Compare algorithm performance
   */
  async compareAlgorithms(request: AlgorithmComparisonRequest): Promise<AlgorithmComparisonResponse> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/algorithms/compare`, request);
      return response.data as AlgorithmComparisonResponse;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update algorithm configuration
   */
  async updateAlgorithmConfig(request: UpdateAlgorithmConfigRequest): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/algorithms/configure`, request);
      return response.data as { success: boolean; message: string };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get available algorithms
   */
  async getAvailableAlgorithms(): Promise<{ algorithms: string[]; configurations: Record<string, any> }> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/algorithms`);
      return response.data as { algorithms: string[]; configurations: Record<string, any> };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Perform system health check
   */
  async performHealthCheck(request: SystemHealthCheckRequest): Promise<SystemHealthCheckResponse> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/health`, request);
      return response.data as SystemHealthCheckResponse;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get system metrics
   */
  async getSystemMetrics(): Promise<{ metrics: Record<string, any>; timestamp: Date }> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/metrics`);
      return response.data as { metrics: Record<string, any>; timestamp: Date };
    } catch (error) {
      throw error;
    }
  }

  // Circuit Breaker Implementation

  /**
   * Check if circuit breaker is open
   */
  private isCircuitBreakerOpen(): boolean {
    if (this.failureCount < this.FAILURE_THRESHOLD) {
      return false;
    }

    if (!this.lastFailureTime) {
      return false;
    }

    const timeSinceLastFailure = Date.now() - this.lastFailureTime.getTime();
    
    // If enough time has passed, allow one test request (half-open state)
    if (timeSinceLastFailure >= this.RESET_TIME_WINDOW) {
      return false;
    }

    return true;
  }

  /**
   * Execute request with circuit breaker protection
   */
  private async executeWithCircuitBreaker<T>(
    operation: () => Promise<T>,
    timeoutMs: number = this.TIMEOUT_DURATION
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error('Request timeout'));
      }, timeoutMs);

      operation()
        .then((result) => {
          clearTimeout(timeoutId);
          resolve(result);
        })
        .catch((error) => {
          clearTimeout(timeoutId);
          reject(error);
        });
    });
  }

  /**
   * Handle successful operation
   */
  private onSuccess(): void {
    this.failureCount = 0;
    this.lastFailureTime = null;
    this.circuitBreakerState = null;
  }

  /**
   * Handle failed operation
   */
  private onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = new Date();

    if (this.failureCount >= this.FAILURE_THRESHOLD) {
      this.circuitBreakerState = {
        isOpen: true,
        failureCount: this.failureCount,
        lastFailureTime: this.lastFailureTime.toISOString(),
        openedAt: new Date().toISOString(),
        halfOpenAttempts: 0,
        state: 'open',
        threshold: {
          failureThreshold: this.FAILURE_THRESHOLD,
          timeoutDuration: this.TIMEOUT_DURATION,
          halfOpenMaxAttempts: 3,
          resetTimeWindow: this.RESET_TIME_WINDOW / 60000, // in minutes
        },
        statistics: {
          totalRequests: 0,
          successfulRequests: 0,
          failedRequests: this.failureCount,
          averageResponseTime: 0,
          lastResetTime: new Date().toISOString(),
          uptime: 0,
        },
      };
    }
  }

  /**
   * Get current circuit breaker state
   */
  public getLocalCircuitBreakerState(): CircuitBreakerState | null {
    return this.circuitBreakerState;
  }

  /**
   * Force reset local circuit breaker
   */
  public forceResetLocalCircuitBreaker(): void {
    this.failureCount = 0;
    this.lastFailureTime = null;
    this.circuitBreakerState = null;
  }
}

// Create and export the singleton instance
let routingApiService: RoutingApiService;

export const getRoutingApiService = (): RoutingApiService => {
  if (!routingApiService) {
    routingApiService = new RoutingApiService();
  }
  return routingApiService;
};

export default RoutingApiService;
