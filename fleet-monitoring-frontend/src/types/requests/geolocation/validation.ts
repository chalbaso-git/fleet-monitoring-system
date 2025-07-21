import { 
  StoreCoordinateRequest, 
  EnhancedCoordinateRequest, 
  CreateGeofenceRequest, 
  LocationQueryFilters,
  BulkCoordinateRequest 
} from './index';
import { validateGpsCoordinates } from '@/types/entities/geolocation/utils';
import { GPS_BOUNDS, GEOFENCE } from '@/types/entities/geolocation/constants';

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validates store coordinate request
 */
export function validateStoreCoordinateRequest(request: StoreCoordinateRequest): ValidationResult {
  const errors: string[] = [];

  // Validate required fields
  if (!request.vehicleId?.trim()) {
    errors.push('Vehicle ID is required and cannot be empty');
  }

  // Validate coordinates
  if (!validateGpsCoordinates(request.latitude, request.longitude)) {
    errors.push(
      `Invalid GPS coordinates. Latitude must be between ${GPS_BOUNDS.LATITUDE.MIN} and ${GPS_BOUNDS.LATITUDE.MAX}, ` +
      `longitude must be between ${GPS_BOUNDS.LONGITUDE.MIN} and ${GPS_BOUNDS.LONGITUDE.MAX}`
    );
  }

  // Validate timestamp
  if (!request.timestamp) {
    errors.push('Timestamp is required');
  } else {
    const date = new Date(request.timestamp);
    if (isNaN(date.getTime())) {
      errors.push('Invalid timestamp format. Expected ISO date string');
    }
    
    // Check if timestamp is not too far in the future
    const now = new Date();
    const maxFutureTime = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes in future
    if (date > maxFutureTime) {
      errors.push('Timestamp cannot be more than 5 minutes in the future');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates enhanced coordinate request
 */
export function validateEnhancedCoordinateRequest(request: EnhancedCoordinateRequest): ValidationResult {
  const baseValidation = validateStoreCoordinateRequest(request);
  const errors = [...baseValidation.errors];

  // Validate optional fields
  if (request.accuracy !== undefined && (request.accuracy < 0 || request.accuracy > 1000)) {
    errors.push('GPS accuracy must be between 0 and 1000 meters');
  }

  if (request.speed !== undefined && request.speed < 0) {
    errors.push('Speed cannot be negative');
  }

  if (request.heading !== undefined && (request.heading < 0 || request.heading >= 360)) {
    errors.push('Heading must be between 0 and 359 degrees');
  }

  if (request.batteryLevel !== undefined && (request.batteryLevel < 0 || request.batteryLevel > 100)) {
    errors.push('Battery level must be between 0 and 100 percent');
  }

  if (request.signalStrength !== undefined && (request.signalStrength < 0 || request.signalStrength > 100)) {
    errors.push('Signal strength must be between 0 and 100 percent');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates bulk coordinate request
 */
export function validateBulkCoordinateRequest(request: BulkCoordinateRequest): ValidationResult {
  const errors: string[] = [];

  if (!request.vehicleId?.trim()) {
    errors.push('Vehicle ID is required for bulk coordinates');
  }

  if (!Array.isArray(request.coordinates) || request.coordinates.length === 0) {
    errors.push('Coordinates array is required and cannot be empty');
  } else {
    if (request.coordinates.length > 1000) {
      errors.push('Cannot process more than 1000 coordinates at once');
    }

    // Validate each coordinate
    request.coordinates.forEach((coord, index) => {
      const validation = validateStoreCoordinateRequest(coord);
      if (!validation.isValid) {
        errors.push(`Coordinate at index ${index}: ${validation.errors.join(', ')}`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates geofence creation request
 */
export function validateCreateGeofenceRequest(request: CreateGeofenceRequest): ValidationResult {
  const errors: string[] = [];

  // Validate name
  if (!request.name?.trim()) {
    errors.push('Geofence name is required and cannot be empty');
  } else if (request.name.length > 100) {
    errors.push('Geofence name cannot exceed 100 characters');
  }

  // Validate type
  if (!GEOFENCE.TYPES.includes(request.type)) {
    errors.push(`Invalid geofence type. Must be one of: ${GEOFENCE.TYPES.join(', ')}`);
  }

  // Validate circle geofence
  if (request.type === 'circle') {
    if (!request.center) {
      errors.push('Center coordinates are required for circle geofence');
    } else if (!validateGpsCoordinates(request.center.latitude, request.center.longitude)) {
      errors.push('Invalid center coordinates for circle geofence');
    }

    if (!request.radius) {
      errors.push('Radius is required for circle geofence');
    } else if (request.radius < GEOFENCE.MIN_RADIUS || request.radius > GEOFENCE.MAX_RADIUS) {
      errors.push(
        `Circle radius must be between ${GEOFENCE.MIN_RADIUS} and ${GEOFENCE.MAX_RADIUS} meters`
      );
    }
  }

  // Validate polygon geofence
  if (request.type === 'polygon') {
    if (!request.coordinates || !Array.isArray(request.coordinates)) {
      errors.push('Coordinates array is required for polygon geofence');
    } else {
      if (request.coordinates.length < 3) {
        errors.push('Polygon geofence requires at least 3 coordinates');
      } else if (request.coordinates.length > GEOFENCE.MAX_POLYGON_POINTS) {
        errors.push(`Polygon geofence cannot have more than ${GEOFENCE.MAX_POLYGON_POINTS} points`);
      }

      // Validate each coordinate
      request.coordinates.forEach((coord, index) => {
        if (!validateGpsCoordinates(coord.latitude, coord.longitude)) {
          errors.push(`Invalid coordinates at polygon point ${index + 1}`);
        }
      });
    }
  }

  // Validate vehicle IDs
  if (!Array.isArray(request.vehicleIds)) {
    errors.push('Vehicle IDs must be provided as an array');
  } else if (request.vehicleIds.length === 0) {
    errors.push('At least one vehicle ID is required');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates location query filters
 */
export function validateLocationQueryFilters(filters: LocationQueryFilters): ValidationResult {
  const errors: string[] = [];

  // Validate date range
  if (filters.startDate && filters.endDate) {
    const startDate = new Date(filters.startDate);
    const endDate = new Date(filters.endDate);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      errors.push('Invalid date format in date range');
    } else if (startDate >= endDate) {
      errors.push('Start date must be before end date');
    }
  }

  // Validate bounds
  if (filters.bounds) {
    const { north, south, east, west } = filters.bounds;
    
    if (north <= south) {
      errors.push('Northern boundary must be greater than southern boundary');
    }
    
    if (east <= west) {
      errors.push('Eastern boundary must be greater than western boundary');
    }
    
    if (!validateGpsCoordinates(north, west) || !validateGpsCoordinates(south, east)) {
      errors.push('Invalid coordinates in boundary definition');
    }
  }

  // Validate pagination
  if (filters.limit !== undefined && (filters.limit < 1 || filters.limit > 10000)) {
    errors.push('Limit must be between 1 and 10000');
  }

  if (filters.offset !== undefined && filters.offset < 0) {
    errors.push('Offset cannot be negative');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Sanitizes and normalizes coordinate request data
 */
export function sanitizeCoordinateRequest(request: StoreCoordinateRequest): StoreCoordinateRequest {
  return {
    vehicleId: request.vehicleId.trim(),
    latitude: Number(request.latitude.toFixed(8)), // Limit precision to ~1mm
    longitude: Number(request.longitude.toFixed(8)),
    timestamp: new Date(request.timestamp).toISOString(),
  };
}
