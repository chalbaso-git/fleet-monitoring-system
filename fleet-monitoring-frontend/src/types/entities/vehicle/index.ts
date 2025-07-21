export interface Vehicle {
  id: string;
  name: string;
  licensePlate: string;
  model: string;
  year: number;
  status: string; // "active", "inactive", "maintenance"
  lastLocation: string;
  lastSeen: Date;
}

export interface VehicleDto {
  id: string;
  name: string;
  licensePlate: string;
  model: string;
  year: number;
  status: string;
  lastLocation: string;
  lastSeen: string; // ISO string from API
}

export interface CreateVehicleRequest {
  name: string;
  licensePlate: string;
  model: string;
  year: number;
  status?: string;
  lastLocation?: string;
  lastSeen?: Date;
}

export interface UpdateVehicleRequest {
  id: string;
  name: string;
  licensePlate: string;
  model: string;
  year: number;
  status: string;
  lastLocation: string;
  lastSeen: Date;
}

export type VehicleStatus = 'active' | 'inactive' | 'maintenance';

export const VEHICLE_STATUS_OPTIONS = [
  { value: 'active', label: 'Activo' },
  { value: 'inactive', label: 'Inactivo' },
  { value: 'maintenance', label: 'Mantenimiento' }
] as const;