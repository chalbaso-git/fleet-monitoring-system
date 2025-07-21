import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GeolocationApiService } from '../../../services/api/geolocation';
import { GpsCoordinate } from '../../../types/entities/geolocation';

// Hook para almacenar coordenada GPS
export const useStoreCoordinate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (coordinate: GpsCoordinate) => GeolocationApiService.storeCoordinate(coordinate),
    onSuccess: () => {
      // Invalidar consultas de ubicaciones
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
    onError: (error) => {
      console.error('Error al almacenar coordenada:', error);
    },
  });
};

const geolocationHooks = { useStoreCoordinate };
export default geolocationHooks;
