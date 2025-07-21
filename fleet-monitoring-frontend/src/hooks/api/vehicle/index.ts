import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { VehicleApiService } from '../../../services/api/vehicle';
import { Vehicle } from '../../../types/entities/vehicle';
import { mockVehicles, getMockVehicleById } from '../../../utils/mockData/vehicles';

// Hook para obtener todos los vehículos
export const useVehicles = (useMockData = false) => {
  return useQuery({
    queryKey: ['vehicles', useMockData],
    queryFn: async () => {
      if (useMockData) {
        return mockVehicles;
      }
      try {
        return await VehicleApiService.getVehicles();
      } catch (error) {
        console.warn('Backend no disponible, usando datos mock:', error);
        return mockVehicles;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para obtener un vehículo por ID
export const useVehicleById = (id: string, enabled = true, useMockData = false) => {
  return useQuery({
    queryKey: ['vehicle', id, useMockData],
    queryFn: async () => {
      if (useMockData) {
        const mockVehicle = getMockVehicleById(id);
        if (!mockVehicle) {
          throw new Error(`Vehículo con ID ${id} no encontrado en datos mock`);
        }
        return mockVehicle;
      }
      try {
        return await VehicleApiService.getVehicleById(id);
      } catch (error) {
        console.warn('Backend no disponible, usando datos mock:', error);
        const mockVehicle = getMockVehicleById(id);
        if (!mockVehicle) {
          throw new Error(`Vehículo con ID ${id} no encontrado`);
        }
        return mockVehicle;
      }
    },
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para eliminar un vehículo
export const useDeleteVehicle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (vehicleId: string) => VehicleApiService.deleteVehicle(vehicleId),
    onSuccess: () => {
      // Invalidar consultas relacionadas con vehículos
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['routes'] });
    },
    onError: (error) => {
      console.error('Error al eliminar vehículo:', error);
    },
  });
};

// Hook para actualizar un vehículo
export const useUpdateVehicle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, vehicleData }: { id: string; vehicleData: Vehicle }) => 
      VehicleApiService.updateVehicle(id, vehicleData),
    onSuccess: (_, variables) => {
      // Invalidar consultas relacionadas
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['vehicle', variables.id] });
    },
    onError: (error) => {
      console.error('Error al actualizar vehículo:', error);
    },
  });
};

const vehicleHooks = { 
  useVehicles,
  useVehicleById,
  useDeleteVehicle, 
  useUpdateVehicle 
};
export default vehicleHooks;
