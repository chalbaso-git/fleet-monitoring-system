import apiClient from '../client';
import { RouteCalculation, RouteCalculationRequest } from '../../../types/entities/routing';

export class RoutingApiService {
  private static readonly BASE_PATH = '/api/routing';

  /**
   * Calculate route between origin and destination
   * POST /api/routing/calculate
   */
  static async calculateRoute(request: RouteCalculationRequest): Promise<RouteCalculation> {
    try {
      const response = await apiClient.post<RouteCalculation>(
        `${RoutingApiService.BASE_PATH}/calculate`,
        request
      );
      return response.data;
    } catch (error) {
      console.error('Error calculating route:', error);
      throw new Error('Failed to calculate route');
    }
  }

  /**
   * Reset circuit breaker
   * POST /api/routing/reset-circuit
   */
  static async resetCircuit(): Promise<string> {
    try {
      const response = await apiClient.post<string>(`${RoutingApiService.BASE_PATH}/reset-circuit`);
      return response.data;
    } catch (error) {
      console.error('Error resetting circuit breaker:', error);
      throw new Error('Failed to reset circuit breaker');
    }
  }
}

export default RoutingApiService;
