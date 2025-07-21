import { 
  AddRouteRequest,
  CreateRouteRequest,
  RouteHistoryFilters,
  OptimizeRouteRequest,
  MultiVehicleRouteRequest,
  RouteSearchFilters,
  UpdateRouteRequest
} from './index';
import { validateRoute } from '@/types/entities/route/utils';
import { ROUTE_LIMITS } from '@/types/entities/route/constants';

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

/**
 * Validates add route request - matches backend RouteDto requirements
 */
export function validateAddRouteRequest(request: AddRouteRequest): ValidationResult {
  const errors: string[] = [];

  // Validate required fields
  if (!request.vehicleId?.trim()) {
    errors.push('Vehicle ID is required and cannot be empty');
  }

  if (!request.path?.trim()) {
    errors.push('Route path is required and cannot be empty');
  }

  if (typeof request.distance !== 'number' || request.distance < 0) {
    errors.push('Distance must be a non-negative number');
  }

  if (request.distance > ROUTE_LIMITS.MAX_DISTANCE_KM) {
    errors.push(`Route distance cannot exceed ${ROUTE_LIMITS.MAX_DISTANCE_KM} km`);
  }

  if (request.distance < ROUTE_LIMITS.MIN_DISTANCE_KM) {
    errors.push(`Route distance must be at least ${ROUTE_LIMITS.MIN_DISTANCE_KM} km`);
  }

  // Validate calculatedAt timestamp
  if (!request.calculatedAt) {
    errors.push('CalculatedAt timestamp is required');
  } else {
    const date = new Date(request.calculatedAt);
    if (isNaN(date.getTime())) {
      errors.push('Invalid calculatedAt timestamp format. Expected ISO date string');
    } else {
      // Check if timestamp is not too far in the future
      const now = new Date();
      const maxFutureTime = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours in future
      if (date > maxFutureTime) {
        errors.push('CalculatedAt timestamp cannot be more than 24 hours in the future');
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates create route request with enhanced parameters
 */
export function validateCreateRouteRequest(request: CreateRouteRequest): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate basic fields
  if (!request.vehicleId?.trim()) {
    errors.push('Vehicle ID is required and cannot be empty');
  }

  if (!Array.isArray(request.waypoints) || request.waypoints.length < 2) {
    errors.push('Route must have at least 2 waypoints (start and destination)');
  } else {
    if (request.waypoints.length > ROUTE_LIMITS.MAX_WAYPOINTS) {
      errors.push(`Route cannot have more than ${ROUTE_LIMITS.MAX_WAYPOINTS} waypoints`);
    }

    // Validate each waypoint
    request.waypoints.forEach((waypoint, index) => {
      if (typeof waypoint.latitude !== 'number' || waypoint.latitude < -90 || waypoint.latitude > 90) {
        errors.push(`Invalid latitude at waypoint ${index + 1}`);
      }

      if (typeof waypoint.longitude !== 'number' || waypoint.longitude < -180 || waypoint.longitude > 180) {
        errors.push(`Invalid longitude at waypoint ${index + 1}`);
      }

      if (waypoint.stopDuration !== undefined) {
        if (waypoint.stopDuration < 0) {
          errors.push(`Stop duration cannot be negative at waypoint ${index + 1}`);
        }
        if (waypoint.stopDuration > ROUTE_LIMITS.MAX_STOP_DURATION_MINUTES) {
          errors.push(`Stop duration cannot exceed ${ROUTE_LIMITS.MAX_STOP_DURATION_MINUTES} minutes at waypoint ${index + 1}`);
        }
      }
    });

    // Check for duplicate coordinates
    const coordinates = request.waypoints.map(wp => `${wp.latitude},${wp.longitude}`);
    const duplicates = coordinates.filter((coord, index) => coordinates.indexOf(coord) !== index);
    if (duplicates.length > 0) {
      warnings.push('Route contains waypoints with identical coordinates');
    }
  }

  // Validate scheduled start time
  if (request.scheduledStartTime) {
    const startTime = new Date(request.scheduledStartTime);
    if (isNaN(startTime.getTime())) {
      errors.push('Invalid scheduledStartTime format. Expected ISO date string');
    } else if (startTime < new Date()) {
      warnings.push('Scheduled start time is in the past');
    }
  }

  // Validate max duration
  if (request.maxDuration !== undefined) {
    if (request.maxDuration < 0) {
      errors.push('Maximum duration cannot be negative');
    }
    if (request.maxDuration > ROUTE_LIMITS.MAX_DURATION_HOURS * 60) {
      errors.push(`Maximum duration cannot exceed ${ROUTE_LIMITS.MAX_DURATION_HOURS} hours`);
    }
  }

  // Validate name length
  if (request.name && request.name.length > 100) {
    errors.push('Route name cannot exceed 100 characters');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings: warnings.length > 0 ? warnings : undefined,
  };
}

/**
 * Validates route history filters
 */
export function validateRouteHistoryFilters(filters: RouteHistoryFilters): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate required fields
  if (!filters.vehicleId?.trim()) {
    errors.push('Vehicle ID is required for route history query');
  }

  if (!filters.from) {
    errors.push('From date is required');
  }

  if (!filters.to) {
    errors.push('To date is required');
  }

  // Validate date formats and range
  if (filters.from && filters.to) {
    const fromDate = new Date(filters.from);
    const toDate = new Date(filters.to);

    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      errors.push('Invalid date format. Expected ISO date string');
    } else {
      if (fromDate >= toDate) {
        errors.push('From date must be before to date');
      }

      // Check for very large date ranges
      const daysDiff = (toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24);
      if (daysDiff > 365) {
        warnings.push('Date range exceeds 1 year - query may be slow');
      }
    }
  }

  // Validate pagination
  if (filters.limit !== undefined && (filters.limit < 1 || filters.limit > 1000)) {
    errors.push('Limit must be between 1 and 1000');
  }

  if (filters.offset !== undefined && filters.offset < 0) {
    errors.push('Offset cannot be negative');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings: warnings.length > 0 ? warnings : undefined,
  };
}

/**
 * Validates route optimization request
 */
export function validateOptimizeRouteRequest(request: OptimizeRouteRequest): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate basic fields
  if (!request.vehicleId?.trim()) {
    errors.push('Vehicle ID is required for route optimization');
  }

  if (!Array.isArray(request.waypoints) || request.waypoints.length < 2) {
    errors.push('At least 2 waypoints required for route optimization');
  } else {
    if (request.waypoints.length > ROUTE_LIMITS.MAX_WAYPOINTS) {
      errors.push(`Cannot optimize routes with more than ${ROUTE_LIMITS.MAX_WAYPOINTS} waypoints`);
    }

    // Validate waypoint coordinates
    request.waypoints.forEach((waypoint, index) => {
      if (typeof waypoint.latitude !== 'number' || waypoint.latitude < -90 || waypoint.latitude > 90) {
        errors.push(`Invalid latitude at waypoint ${index + 1}`);
      }

      if (typeof waypoint.longitude !== 'number' || waypoint.longitude < -180 || waypoint.longitude > 180) {
        errors.push(`Invalid longitude at waypoint ${index + 1}`);
      }
    });
  }

  // Validate constraints
  if (request.constraints) {
    if (request.constraints.maxDistance !== undefined && request.constraints.maxDistance <= 0) {
      errors.push('Maximum distance constraint must be positive');
    }

    if (request.constraints.maxDuration !== undefined && request.constraints.maxDuration <= 0) {
      errors.push('Maximum duration constraint must be positive');
    }

    // Validate working hours
    if (request.constraints.workingHours) {
      const { start, end } = request.constraints.workingHours;
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      
      if (!timeRegex.test(start)) {
        errors.push('Invalid working hours start time format. Expected HH:MM');
      }
      
      if (!timeRegex.test(end)) {
        errors.push('Invalid working hours end time format. Expected HH:MM');
      }

      if (timeRegex.test(start) && timeRegex.test(end)) {
        const startMinutes = parseInt(start.split(':')[0]) * 60 + parseInt(start.split(':')[1]);
        const endMinutes = parseInt(end.split(':')[0]) * 60 + parseInt(end.split(':')[1]);
        
        if (startMinutes >= endMinutes) {
          warnings.push('Working hours end time should be after start time');
        }
      }
    }

    // Validate breaks
    if (request.constraints.breaks) {
      request.constraints.breaks.forEach((breakInfo, index) => {
        if (breakInfo.afterHours <= 0) {
          errors.push(`Break ${index + 1}: afterHours must be positive`);
        }
        if (breakInfo.duration <= 0) {
          errors.push(`Break ${index + 1}: duration must be positive`);
        }
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings: warnings.length > 0 ? warnings : undefined,
  };
}

/**
 * Validates multi-vehicle route request
 */
export function validateMultiVehicleRouteRequest(request: MultiVehicleRouteRequest): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate basic fields
  if (!request.name?.trim()) {
    errors.push('Multi-vehicle route name is required');
  }

  if (!Array.isArray(request.vehicleAssignments) || request.vehicleAssignments.length === 0) {
    errors.push('At least one vehicle assignment is required');
  } else {
    if (request.vehicleAssignments.length > 50) {
      errors.push('Cannot plan routes for more than 50 vehicles simultaneously');
    }

    // Validate each vehicle assignment
    const vehicleIds = new Set();
    request.vehicleAssignments.forEach((assignment, index) => {
      if (!assignment.vehicleId?.trim()) {
        errors.push(`Vehicle ID is required for assignment ${index + 1}`);
      } else {
        if (vehicleIds.has(assignment.vehicleId)) {
          errors.push(`Duplicate vehicle ID: ${assignment.vehicleId}`);
        }
        vehicleIds.add(assignment.vehicleId);
      }

      if (!Array.isArray(assignment.waypoints) || assignment.waypoints.length < 2) {
        errors.push(`Assignment ${index + 1}: At least 2 waypoints required`);
      }

      // Validate time windows
      if (assignment.timeWindow) {
        const { earliestStart, latestStart } = assignment.timeWindow;
        
        if (earliestStart && latestStart) {
          const earliestDate = new Date(earliestStart);
          const latestDate = new Date(latestStart);
          
          if (isNaN(earliestDate.getTime()) || isNaN(latestDate.getTime())) {
            errors.push(`Assignment ${index + 1}: Invalid time window date format`);
          } else if (earliestDate >= latestDate) {
            errors.push(`Assignment ${index + 1}: Earliest start must be before latest start`);
          }
        }
      }
    });
  }

  // Validate coordination points
  if (request.coordinationPoints) {
    request.coordinationPoints.forEach((point, index) => {
      if (!point.scheduledTime) {
        errors.push(`Coordination point ${index + 1}: Scheduled time is required`);
      } else {
        const scheduledDate = new Date(point.scheduledTime);
        if (isNaN(scheduledDate.getTime())) {
          errors.push(`Coordination point ${index + 1}: Invalid scheduled time format`);
        }
      }

      if (!Array.isArray(point.involvedVehicles) || point.involvedVehicles.length === 0) {
        errors.push(`Coordination point ${index + 1}: At least one involved vehicle required`);
      }
    });
  }

  // Validate global constraints
  if (request.globalConstraints) {
    if (request.globalConstraints.maxTotalDistance !== undefined && request.globalConstraints.maxTotalDistance <= 0) {
      errors.push('Maximum total distance must be positive');
    }

    if (request.globalConstraints.synchronizationTolerance !== undefined && request.globalConstraints.synchronizationTolerance < 0) {
      errors.push('Synchronization tolerance cannot be negative');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings: warnings.length > 0 ? warnings : undefined,
  };
}

/**
 * Validates route search filters for performance and correctness
 */
export function validateRouteSearchFilters(filters: RouteSearchFilters): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate date range
  if (filters.dateRange) {
    const { from, to } = filters.dateRange;
    const fromDate = new Date(from);
    const toDate = new Date(to);

    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      errors.push('Invalid date range format. Expected ISO date strings');
    } else if (fromDate >= toDate) {
      errors.push('Date range: from date must be before to date');
    } else {
      const daysDiff = (toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24);
      if (daysDiff > 365) {
        warnings.push('Date range exceeds 1 year - query may be slow');
      }
    }
  }

  // Validate distance range
  if (filters.distanceRange) {
    if (filters.distanceRange.min < 0 || filters.distanceRange.max < 0) {
      errors.push('Distance range values cannot be negative');
    }
    if (filters.distanceRange.min >= filters.distanceRange.max) {
      errors.push('Distance range: minimum must be less than maximum');
    }
  }

  // Validate duration range
  if (filters.durationRange) {
    if (filters.durationRange.min < 0 || filters.durationRange.max < 0) {
      errors.push('Duration range values cannot be negative');
    }
    if (filters.durationRange.min >= filters.durationRange.max) {
      errors.push('Duration range: minimum must be less than maximum');
    }
  }

  // Validate bounding box
  if (filters.boundingBox) {
    const { north, south, east, west } = filters.boundingBox;
    
    if (north <= south) {
      errors.push('Bounding box: north must be greater than south');
    }
    
    if (east <= west) {
      errors.push('Bounding box: east must be greater than west');
    }
    
    if (north < -90 || north > 90 || south < -90 || south > 90) {
      errors.push('Bounding box: latitude values must be between -90 and 90');
    }
    
    if (east < -180 || east > 180 || west < -180 || west > 180) {
      errors.push('Bounding box: longitude values must be between -180 and 180');
    }
  }

  // Validate pagination
  if (filters.limit !== undefined && (filters.limit < 1 || filters.limit > 1000)) {
    errors.push('Limit must be between 1 and 1000');
  }

  if (filters.offset !== undefined && filters.offset < 0) {
    errors.push('Offset cannot be negative');
  }

  // Performance warnings
  if (!filters.limit || filters.limit > 100) {
    warnings.push('Large result sets may impact performance - consider using smaller limits');
  }

  if (filters.vehicleIds && filters.vehicleIds.length > 50) {
    warnings.push('Filtering by many vehicle IDs may impact performance');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings: warnings.length > 0 ? warnings : undefined,
  };
}

/**
 * Sanitizes and normalizes route request data
 */
export function sanitizeAddRouteRequest(request: AddRouteRequest): AddRouteRequest {
  return {
    vehicleId: request.vehicleId.trim(),
    path: request.path.trim(),
    distance: Number(request.distance.toFixed(3)), // Limit precision to meters
    calculatedAt: new Date(request.calculatedAt).toISOString(),
  };
}
