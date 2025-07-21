import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// Cambiar esta línea problemática:
// import { VehicleApiService } from '@/services/api/vehicle';
// Por esta (ruta relativa):
import { VehicleApiService } from '../../../services/api/vehicle';

import { Vehicle } from '../../../types/entities/vehicle';
import { toast } from 'sonner';

const QUERY_KEYS = {
  vehicles: ['vehicles'],
  vehicle: (id: string) => ['vehicles', id],
} as const;

export const useVehicles = () => {
  return useQuery({
    queryKey: QUERY_KEYS.vehicles,
    queryFn: VehicleApiService.getVehicles,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

export const useVehicle = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.vehicle(id),
    queryFn: () => VehicleApiService.getVehicleById(id),
    enabled: !!id,
    retry: 2,
  });
};

export const useUpdateVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, vehicleData }: { id: string; vehicleData: Vehicle }) =>
      VehicleApiService.updateVehicle(id, vehicleData),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.vehicles });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.vehicle(id) });
      toast.success('Vehículo actualizado correctamente');
    },
    onError: (error) => {
      toast.error('Error al actualizar el vehículo');
      console.error('Update vehicle error:', error);
    },
  });
};

export const useDeleteVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: VehicleApiService.deleteVehicle,
    onSuccess: (message) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.vehicles });
      toast.success(message || 'Vehículo eliminado correctamente');
    },
    onError: (error) => {
      toast.error('Error al eliminar el vehículo');
      console.error('Delete vehicle error:', error);
    },
  });
};