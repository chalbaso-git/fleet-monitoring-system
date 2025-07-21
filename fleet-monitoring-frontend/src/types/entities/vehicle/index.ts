/**
 * Vehicle entity types for fleet monitoring system
 */

export interface Vehicle {
  id: string;
  name: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  vin?: string;
  status: VehicleStatus;
  type: VehicleType;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface VehicleWithMetadata extends Vehicle {
  lastKnownLocation?: {
    latitude: number;
    longitude: number;
    timestamp: string;
    address?: string;
  };
  currentDriver?: {
    id: string;
    name: string;
    contact: string;
  };
  totalMileage: number;
  fuelLevel?: number;
  batteryLevel?: number;
  engineStatus: EngineStatus;
  maintenanceStatus: MaintenanceStatus;
  alerts: VehicleAlert[];
  performance: VehiclePerformanceMetrics;
}

export interface VehicleAlert {
  id: string;
  vehicleId: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  description: string;
  timestamp: string;
  isResolved: boolean;
  resolvedAt?: string;
  metadata?: Record<string, any>;
}

export interface VehiclePerformanceMetrics {
  fuelEfficiency: number; // km/L or miles/gallon
  averageSpeed: number; // km/h
  idleTime: number; // minutes per day
  maintenanceScore: number; // 0-100
  utilizationRate: number; // percentage
  carbonEmissions: number; // kg CO2 per day
  costPerKilometer: number;
  uptime: number; // percentage
}

export interface VehicleMaintenanceRecord {
  id: string;
  vehicleId: string;
  type: MaintenanceType;
  description: string;
  cost: number;
  currency: string;
  performedAt: string;
  performedBy: string;
  nextScheduledAt?: string;
  partsCost: number;
  laborCost: number;
  notes?: string;
  attachments: string[];
}

export interface VehicleInsurance {
  id: string;
  vehicleId: string;
  provider: string;
  policyNumber: string;
  startDate: string;
  endDate: string;
  coverage: InsuranceCoverage[];
  premium: number;
  currency: string;
  isActive: boolean;
}

export interface VehicleDocument {
  id: string;
  vehicleId: string;
  type: DocumentType;
  title: string;
  description?: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
  expiresAt?: string;
  isValid: boolean;
}

export interface VehicleGeofence {
  id: string;
  vehicleId: string;
  name: string;
  type: GeofenceType;
  coordinates: GeofenceCoordinates;
  isActive: boolean;
  notifications: GeofenceNotification[];
  createdAt: string;
  updatedAt: string;
}

export interface GeofenceCoordinates {
  type: 'circle' | 'polygon';
  center?: {
    latitude: number;
    longitude: number;
  };
  radius?: number; // meters
  polygon?: Array<{
    latitude: number;
    longitude: number;
  }>;
}

export interface GeofenceNotification {
  id: string;
  type: 'entry' | 'exit' | 'dwell';
  isEnabled: boolean;
  recipients: string[];
  message: string;
}

// Enums and Types
export type VehicleStatus = 
  | 'active'
  | 'inactive' 
  | 'maintenance'
  | 'out_of_service'
  | 'decommissioned';

export type VehicleType = 
  | 'car'
  | 'truck'
  | 'van'
  | 'motorcycle'
  | 'bus'
  | 'trailer'
  | 'heavy_equipment';

export type EngineStatus = 
  | 'running'
  | 'idle'
  | 'off'
  | 'error'
  | 'maintenance_required';

export type MaintenanceStatus = 
  | 'up_to_date'
  | 'due_soon'
  | 'overdue'
  | 'in_maintenance'
  | 'critical';

export type AlertType = 
  | 'engine'
  | 'fuel'
  | 'battery'
  | 'tire'
  | 'brake'
  | 'temperature'
  | 'security'
  | 'geofence'
  | 'maintenance'
  | 'driver_behavior';

export type AlertSeverity = 
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

export type MaintenanceType = 
  | 'oil_change'
  | 'tire_rotation'
  | 'brake_service'
  | 'battery_replacement'
  | 'engine_service'
  | 'transmission_service'
  | 'air_filter'
  | 'fuel_filter'
  | 'coolant_service'
  | 'general_inspection'
  | 'repair'
  | 'recall_service';

export type InsuranceCoverage = 
  | 'liability'
  | 'collision'
  | 'comprehensive'
  | 'uninsured_motorist'
  | 'personal_injury'
  | 'roadside_assistance';

export type DocumentType = 
  | 'registration'
  | 'insurance'
  | 'inspection'
  | 'maintenance_record'
  | 'warranty'
  | 'manual'
  | 'photo'
  | 'other';

export type GeofenceType = 
  | 'home_base'
  | 'customer_site'
  | 'service_area'
  | 'restricted_zone'
  | 'maintenance_facility'
  | 'fuel_station'
  | 'custom';
