/**
 * Vehicle-related constants and enums
 */

// Vehicle Status Constants
export const VEHICLE_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  MAINTENANCE: 'maintenance',
  OUT_OF_SERVICE: 'out_of_service',
  DECOMMISSIONED: 'decommissioned',
} as const;

// Vehicle Type Constants
export const VEHICLE_TYPES = {
  CAR: 'car',
  TRUCK: 'truck',
  VAN: 'van',
  MOTORCYCLE: 'motorcycle',
  BUS: 'bus',
  TRAILER: 'trailer',
  HEAVY_EQUIPMENT: 'heavy_equipment',
} as const;

// Engine Status Constants
export const ENGINE_STATUS = {
  RUNNING: 'running',
  IDLE: 'idle',
  OFF: 'off',
  ERROR: 'error',
  MAINTENANCE_REQUIRED: 'maintenance_required',
} as const;

// Maintenance Status Constants
export const MAINTENANCE_STATUS = {
  UP_TO_DATE: 'up_to_date',
  DUE_SOON: 'due_soon',
  OVERDUE: 'overdue',
  IN_MAINTENANCE: 'in_maintenance',
  CRITICAL: 'critical',
} as const;

// Alert Types
export const ALERT_TYPES = {
  ENGINE: 'engine',
  FUEL: 'fuel',
  BATTERY: 'battery',
  TIRE: 'tire',
  BRAKE: 'brake',
  TEMPERATURE: 'temperature',
  SECURITY: 'security',
  GEOFENCE: 'geofence',
  MAINTENANCE: 'maintenance',
  DRIVER_BEHAVIOR: 'driver_behavior',
} as const;

// Alert Severity Levels
export const ALERT_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

// Maintenance Types
export const MAINTENANCE_TYPES = {
  OIL_CHANGE: 'oil_change',
  TIRE_ROTATION: 'tire_rotation',
  BRAKE_SERVICE: 'brake_service',
  BATTERY_REPLACEMENT: 'battery_replacement',
  ENGINE_SERVICE: 'engine_service',
  TRANSMISSION_SERVICE: 'transmission_service',
  AIR_FILTER: 'air_filter',
  FUEL_FILTER: 'fuel_filter',
  COOLANT_SERVICE: 'coolant_service',
  GENERAL_INSPECTION: 'general_inspection',
  REPAIR: 'repair',
  RECALL_SERVICE: 'recall_service',
} as const;

// Document Types
export const DOCUMENT_TYPES = {
  REGISTRATION: 'registration',
  INSURANCE: 'insurance',
  INSPECTION: 'inspection',
  MAINTENANCE_RECORD: 'maintenance_record',
  WARRANTY: 'warranty',
  MANUAL: 'manual',
  PHOTO: 'photo',
  OTHER: 'other',
} as const;

// Geofence Types
export const GEOFENCE_TYPES = {
  HOME_BASE: 'home_base',
  CUSTOMER_SITE: 'customer_site',
  SERVICE_AREA: 'service_area',
  RESTRICTED_ZONE: 'restricted_zone',
  MAINTENANCE_FACILITY: 'maintenance_facility',
  FUEL_STATION: 'fuel_station',
  CUSTOM: 'custom',
} as const;

// Insurance Coverage Types
export const INSURANCE_COVERAGE = {
  LIABILITY: 'liability',
  COLLISION: 'collision',
  COMPREHENSIVE: 'comprehensive',
  UNINSURED_MOTORIST: 'uninsured_motorist',
  PERSONAL_INJURY: 'personal_injury',
  ROADSIDE_ASSISTANCE: 'roadside_assistance',
} as const;

// Vehicle Performance Thresholds
export const PERFORMANCE_THRESHOLDS = {
  FUEL_EFFICIENCY: {
    EXCELLENT: 25, // km/L or better
    GOOD: 20,
    FAIR: 15,
    POOR: 10,
  },
  MAINTENANCE_SCORE: {
    EXCELLENT: 90,
    GOOD: 75,
    FAIR: 60,
    POOR: 40,
  },
  UTILIZATION_RATE: {
    HIGH: 80, // percentage
    MEDIUM: 60,
    LOW: 40,
  },
  UPTIME: {
    EXCELLENT: 95, // percentage
    GOOD: 90,
    FAIR: 85,
    POOR: 80,
  },
} as const;

// Vehicle Limits and Constraints
export const VEHICLE_LIMITS = {
  MAX_NAME_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 500,
  MAX_LICENSE_PLATE_LENGTH: 15,
  MAX_VIN_LENGTH: 17,
  MIN_YEAR: 1900,
  MAX_YEAR: new Date().getFullYear() + 1,
  MAX_ALERTS_PER_VEHICLE: 100,
  MAX_DOCUMENTS_PER_VEHICLE: 50,
  MAX_GEOFENCES_PER_VEHICLE: 20,
  MAX_FILE_SIZE_MB: 10,
} as const;

// Default Values
export const VEHICLE_DEFAULTS = {
  STATUS: VEHICLE_STATUS.ACTIVE,
  TYPE: VEHICLE_TYPES.CAR,
  ENGINE_STATUS: ENGINE_STATUS.OFF,
  MAINTENANCE_STATUS: MAINTENANCE_STATUS.UP_TO_DATE,
  FUEL_LEVEL: 100,
  BATTERY_LEVEL: 100,
  PERFORMANCE_METRICS: {
    fuelEfficiency: 0,
    averageSpeed: 0,
    idleTime: 0,
    maintenanceScore: 100,
    utilizationRate: 0,
    carbonEmissions: 0,
    costPerKilometer: 0,
    uptime: 100,
  },
} as const;

// Display Labels
export const VEHICLE_STATUS_LABELS = {
  [VEHICLE_STATUS.ACTIVE]: 'Active',
  [VEHICLE_STATUS.INACTIVE]: 'Inactive',
  [VEHICLE_STATUS.MAINTENANCE]: 'In Maintenance',
  [VEHICLE_STATUS.OUT_OF_SERVICE]: 'Out of Service',
  [VEHICLE_STATUS.DECOMMISSIONED]: 'Decommissioned',
} as const;

export const VEHICLE_TYPE_LABELS = {
  [VEHICLE_TYPES.CAR]: 'Car',
  [VEHICLE_TYPES.TRUCK]: 'Truck',
  [VEHICLE_TYPES.VAN]: 'Van',
  [VEHICLE_TYPES.MOTORCYCLE]: 'Motorcycle',
  [VEHICLE_TYPES.BUS]: 'Bus',
  [VEHICLE_TYPES.TRAILER]: 'Trailer',
  [VEHICLE_TYPES.HEAVY_EQUIPMENT]: 'Heavy Equipment',
} as const;

export const ENGINE_STATUS_LABELS = {
  [ENGINE_STATUS.RUNNING]: 'Running',
  [ENGINE_STATUS.IDLE]: 'Idle',
  [ENGINE_STATUS.OFF]: 'Off',
  [ENGINE_STATUS.ERROR]: 'Error',
  [ENGINE_STATUS.MAINTENANCE_REQUIRED]: 'Maintenance Required',
} as const;

export const MAINTENANCE_STATUS_LABELS = {
  [MAINTENANCE_STATUS.UP_TO_DATE]: 'Up to Date',
  [MAINTENANCE_STATUS.DUE_SOON]: 'Due Soon',
  [MAINTENANCE_STATUS.OVERDUE]: 'Overdue',
  [MAINTENANCE_STATUS.IN_MAINTENANCE]: 'In Maintenance',
  [MAINTENANCE_STATUS.CRITICAL]: 'Critical',
} as const;

export const ALERT_SEVERITY_LABELS = {
  [ALERT_SEVERITY.LOW]: 'Low',
  [ALERT_SEVERITY.MEDIUM]: 'Medium',
  [ALERT_SEVERITY.HIGH]: 'High',
  [ALERT_SEVERITY.CRITICAL]: 'Critical',
} as const;

// Status Colors for UI
export const STATUS_COLORS = {
  VEHICLE_STATUS: {
    [VEHICLE_STATUS.ACTIVE]: '#4CAF50', // Green
    [VEHICLE_STATUS.INACTIVE]: '#FF9800', // Orange
    [VEHICLE_STATUS.MAINTENANCE]: '#2196F3', // Blue
    [VEHICLE_STATUS.OUT_OF_SERVICE]: '#F44336', // Red
    [VEHICLE_STATUS.DECOMMISSIONED]: '#9E9E9E', // Grey
  },
  ENGINE_STATUS: {
    [ENGINE_STATUS.RUNNING]: '#4CAF50', // Green
    [ENGINE_STATUS.IDLE]: '#FF9800', // Orange
    [ENGINE_STATUS.OFF]: '#9E9E9E', // Grey
    [ENGINE_STATUS.ERROR]: '#F44336', // Red
    [ENGINE_STATUS.MAINTENANCE_REQUIRED]: '#FF5722', // Deep Orange
  },
  MAINTENANCE_STATUS: {
    [MAINTENANCE_STATUS.UP_TO_DATE]: '#4CAF50', // Green
    [MAINTENANCE_STATUS.DUE_SOON]: '#FF9800', // Orange
    [MAINTENANCE_STATUS.OVERDUE]: '#F44336', // Red
    [MAINTENANCE_STATUS.IN_MAINTENANCE]: '#2196F3', // Blue
    [MAINTENANCE_STATUS.CRITICAL]: '#D32F2F', // Dark Red
  },
  ALERT_SEVERITY: {
    [ALERT_SEVERITY.LOW]: '#4CAF50', // Green
    [ALERT_SEVERITY.MEDIUM]: '#FF9800', // Orange
    [ALERT_SEVERITY.HIGH]: '#F44336', // Red
    [ALERT_SEVERITY.CRITICAL]: '#D32F2F', // Dark Red
  },
} as const;
