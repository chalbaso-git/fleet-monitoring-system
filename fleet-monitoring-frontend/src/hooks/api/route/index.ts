import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { RouteApiService } from '../../../services/api/route';
import { Route } from '../../../types/entities/route';

// Hook para obtener todas las rutas
export const useRoutes = () => {
  return useQuery({
    queryKey: ['routes'],
    queryFn: () => RouteApiService.getRoutes(),
    staleTime: 60000, // 1 minuto
  });
};

// Hook para obtener rutas por vehículo y fecha
export const useRoutesByVehicleAndDate = (vehicleId: string, date: string) => {
  return useQuery({
    queryKey: ['routes', 'by-vehicle-date', vehicleId, date],
    queryFn: () => RouteApiService.getRoutesByVehicleAndDate(vehicleId, date),
    enabled: !!vehicleId && !!date, // Solo ejecutar si hay vehicleId y date
    staleTime: 60000, // 1 minuto
  });
};

// Hook para crear una nueva ruta
export const useAddRoute = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (route: Omit<Route, 'id'>) => RouteApiService.addRoute(route),
    onSuccess: () => {
      // Invalidar y refetch las rutas después de crear una nueva
      queryClient.invalidateQueries({ queryKey: ['routes'] });
    },
    onError: (error) => {
      console.error('Error al crear ruta:', error);
    },
  });
};

const routeHooks = { useRoutes, useRoutesByVehicleAndDate, useAddRoute };
export default routeHooks;
