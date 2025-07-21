import apiClient from '../client';
import { Route } from '../../../types/entities/route';

export class RouteApiService {
  private static readonly BASE_PATH = '/api/route';

  /**
   * Add a new route
   * POST /api/route
   */
  static async addRoute(route: Omit<Route, 'id'>): Promise<string> {
    try {
      const response = await apiClient.post<string>(RouteApiService.BASE_PATH, route);
      return response.data;
    } catch (error) {
      console.error('Error adding route:', error);
      throw new Error('Failed to add route');
    }
  }

  /**
   * Get all routes
   * GET /api/route
   */
  static async getRoutes(): Promise<Route[]> {
    try {
      const response = await apiClient.get<Route[]>(RouteApiService.BASE_PATH);
      return response.data;
    } catch (error) {
      console.error('Error fetching routes:', error);
      throw new Error('Failed to fetch routes');
    }
  }

  /**
   * Get routes by vehicle and date
   * GET /api/route/by-vehicle-and-date
   */
  static async getRoutesByVehicleAndDate(vehicleId: string, date: string): Promise<Route[]> {
    try {
      const response = await apiClient.get<Route[]>(
        `${RouteApiService.BASE_PATH}/by-vehicle-and-date`,
        {
          params: { vehicleId, date }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching routes by vehicle and date:', error);
      throw new Error('Failed to fetch routes by vehicle and date');
    }
  }
}

export default RouteApiService;
