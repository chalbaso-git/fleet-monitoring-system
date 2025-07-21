import { useMutation } from '@tanstack/react-query';
import GeolocationApiService from '../../../services/api/geolocation';
import { GpsCoordinate } from '../../../types/entities/geolocation';

/**
 * Hook to store GPS coordinates
 * Uses POST /api/geolocation/store-coordinate
 */
export const useStoreCoordinate = () => {
  return useMutation({
    mutationFn: (coordinate: GpsCoordinate) => GeolocationApiService.storeCoordinate(coordinate),
    onError: (error) => {
      console.error('Error storing coordinate:', error);
    },
  });
};
