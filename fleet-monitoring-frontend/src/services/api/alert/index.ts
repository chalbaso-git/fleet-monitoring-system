import apiClient from '../client';
import { Alert } from '../../../types/entities/alert';

export class AlertApiService {
  private static readonly BASE_PATH = '/api/alert';

  /**
   * Register a new alert in the system
   * POST /api/alert
   */
  static async addAlert(alert: Alert): Promise<string> {
    try {
      const response = await apiClient.post<string>(AlertApiService.BASE_PATH, alert);
      return response.data;
    } catch (error) {
      console.error('Error adding alert:', error);
      throw new Error('Failed to add alert');
    }
  }

  /**
   * Get all registered alerts
   * GET /api/alert
   */
  static async getAlerts(): Promise<Alert[]> {
    try {
      const response = await apiClient.get<Alert[]>(AlertApiService.BASE_PATH);
      return response.data;
    } catch (error) {
      console.error('Error fetching alerts:', error);
      throw new Error('Failed to fetch alerts');
    }
  }
}

export default AlertApiService;
