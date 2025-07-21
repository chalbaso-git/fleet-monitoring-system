/**
 * Mock data for Vehicle entities
 * This data matches the exact VehicleDto structure from backend
 */

import { Vehicle } from '../../types/entities/vehicle';

export const mockVehicles: Vehicle[] = [
  {
    id: 'VEH-001',
    name: 'Camión de Reparto Norte',
    licensePlate: 'ABC-123',
    model: 'Mercedes Sprinter',
    year: 2022,
    status: 'active',
    lastLocation: 'Bogotá Centro, Carrera 7 #32-16',
    lastSeen: '2024-01-15T10:30:00Z',
  },
  {
    id: 'VEH-002',
    name: 'Furgón de Entrega Sur',
    licensePlate: 'DEF-456',
    model: 'Ford Transit',
    year: 2021,
    status: 'maintenance',
    lastLocation: 'Taller Central, Zona Sur',
    lastSeen: '2024-01-15T08:45:00Z',
  },
  {
    id: 'VEH-003',
    name: 'Camión de Carga Pesada',
    licensePlate: 'GHI-789',
    model: 'Chevrolet NPR',
    year: 2023,
    status: 'active',
    lastLocation: 'Soacha, Autopista Sur Km 18',
    lastSeen: '2024-01-15T11:15:00Z',
  },
  {
    id: 'VEH-004',
    name: 'Van de Distribución',
    licensePlate: 'JKL-012',
    model: 'Renault Master',
    year: 2020,
    status: 'offline',
    lastLocation: 'Última ubicación conocida: Calle 80',
    lastSeen: '2024-01-14T16:20:00Z',
  },
  {
    id: 'VEH-005',
    name: 'Pickup de Servicios',
    licensePlate: 'MNO-345',
    model: 'Toyota Hilux',
    year: 2023,
    status: 'active',
    lastLocation: 'Chapinero, Zona Rosa',
    lastSeen: '2024-01-15T12:00:00Z',
  },
  {
    id: 'VEH-006',
    name: 'Camión Refrigerado',
    licensePlate: 'PQR-678',
    model: 'Isuzu NPR',
    year: 2021,
    status: 'inactive',
    lastLocation: 'Parqueadero Principal',
    lastSeen: '2024-01-15T07:30:00Z',
  },
];

export const getMockVehicleById = (id: string): Vehicle | undefined => {
  return mockVehicles.find(vehicle => vehicle.id === id);
};

export const getMockVehiclesByStatus = (status: string): Vehicle[] => {
  return mockVehicles.filter(vehicle => 
    vehicle.status.toLowerCase() === status.toLowerCase()
  );
};

export const getMockVehiclesStats = () => {
  return {
    total: mockVehicles.length,
    active: mockVehicles.filter(v => v.status.toLowerCase() === 'active').length,
    maintenance: mockVehicles.filter(v => v.status.toLowerCase() === 'maintenance').length,
    offline: mockVehicles.filter(v => v.status.toLowerCase() === 'offline').length,
    inactive: mockVehicles.filter(v => v.status.toLowerCase() === 'inactive').length,
  };
};

export default mockVehicles;
