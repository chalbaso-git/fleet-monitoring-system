import apiClient from '../client';
import { GpsCoordinate } from '../../../types/entities/geolocation';

export class GeolocationApiService {
  private static readonly BASE_PATH = '/api/geolocation';

  /**
   * Store GPS coordinate for a vehicle
   * POST /api/geolocation/store-coordinate
   */
  static async storeCoordinate(coordinate: GpsCoordinate): Promise<string> {
    try {
      const response = await apiClient.post<string>(
        `${GeolocationApiService.BASE_PATH}/store-coordinate`,
        coordinate
      );
      return response.data;
    } catch (error) {
      console.error('Error storing GPS coordinate:', error);
      throw new Error('Failed to store GPS coordinate');
    }
  }
}

export default GeolocationApiService;
