/**
 * Vehicle request and response types
 */

import { Vehicle } from '../../entities/vehicle';

// Para crear un nuevo vehículo (si se implementa el endpoint POST)
export interface CreateVehicleRequest {
  name: string;
  licensePlate: string;
  model: string;
  year: number;
  status?: string; // Opcional, default "active"
  lastLocation?: string; // Opcional, default empty
}

// Para actualizar un vehículo existente
export interface UpdateVehicleRequest {
  id: string;
  name?: string;
  licensePlate?: string;
  model?: string;
  year?: number;
  status?: string;
  lastLocation?: string;
}

// Respuesta al eliminar un vehículo
export interface DeleteVehicleResponse {
  message: string;
  success: boolean;
}

// Lista de vehículos
export interface GetVehiclesResponse {
  vehicles: Vehicle[];
  totalCount: number;
}
