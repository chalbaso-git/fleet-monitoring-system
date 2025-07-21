import { Route, RouteWaypoint, RoutePerformance, RouteCostAnalysis } from './index';
import { 
  ROUTE_LIMITS, 
  FUEL_CONSUMPTION_RATES, 
  COST_FACTORS, 
  ROUTE_TOLERANCES,
  VehicleType
} from './constants';

/**
 * Parse route path string into structured waypoints
 * The path is stored as a serialized string in the backend
 */
export function parseRoutePath(pathString: string): RouteWaypoint[] {
  try {
    // Attempt to parse JSON path
    const parsed = JSON.parse(pathString);
    
    if (Array.isArray(parsed)) {
      return parsed.map((point, index) => ({
        id: point.id || `waypoint_${index}`,
        latitude: point.latitude || point.lat,
        longitude: point.longitude || point.lng,
        address: point.address || point.name || '',
        type: point.type || (index === 0 ? 'start' : index === parsed.length - 1 ? 'destination' : 'waypoint'),
        arrivalTime: point.arrivalTime,
        departureTime: point.departureTime,
        stopDuration: point.stopDuration || 0,
        order: index,
        isCompleted: point.isCompleted || false,
        notes: point.notes || '',
      }));
    }
    
    // If not array, try to parse as coordinate pairs
    return parseCoordinateString(pathString);
  } catch {
    // Fallback to coordinate string parsing
    return parseCoordinateString(pathString);
  }
}

/**
 * Parse coordinate string format like "lat1,lng1;lat2,lng2;..."
 */
function parseCoordinateString(pathString: string): RouteWaypoint[] {
  const coordinates = pathString.split(';')
    .map(pair => pair.split(','))
    .filter(coords => coords.length === 2)
    .map(coords => ({
      latitude: parseFloat(coords[0]),
      longitude: parseFloat(coords[1]),
    }))
    .filter(coord => !isNaN(coord.latitude) && !isNaN(coord.longitude));

  return coordinates.map((coord, index) => ({
    id: `waypoint_${index}`,
    latitude: coord.latitude,
    longitude: coord.longitude,
    type: index === 0 ? 'start' : index === coordinates.length - 1 ? 'destination' : 'waypoint',
    order: index,
    isCompleted: false,
  } as RouteWaypoint));
}

/**
 * Serialize waypoints back to path string for storage
 */
export function serializeRoutePath(waypoints: RouteWaypoint[]): string {
  // Use JSON format for rich data
  const serializedWaypoints = waypoints.map(waypoint => ({
    id: waypoint.id,
    latitude: waypoint.latitude,
    longitude: waypoint.longitude,
    address: waypoint.address,
    type: waypoint.type,
    arrivalTime: waypoint.arrivalTime,
    departureTime: waypoint.departureTime,
    stopDuration: waypoint.stopDuration,
    order: waypoint.order,
    isCompleted: waypoint.isCompleted,
    notes: waypoint.notes,
  }));

  return JSON.stringify(serializedWaypoints);
}

/**
 * Calculate distance between two coordinates using Haversine formula
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Calculate total route distance from waypoints
 */
export function calculateTotalDistance(waypoints: RouteWaypoint[]): number {
  if (waypoints.length < 2) return 0;

  let totalDistance = 0;
  for (let i = 1; i < waypoints.length; i++) {
    const prev = waypoints[i - 1];
    const curr = waypoints[i];
    totalDistance += calculateDistance(prev.latitude, prev.longitude, curr.latitude, curr.longitude);
  }

  return totalDistance;
}

/**
 * Estimate route duration based on distance and average speeds
 */
export function estimateRouteDuration(
  waypoints: RouteWaypoint[],
  averageSpeed: number = ROUTE_LIMITS.DEFAULT_SPEED_KMH
): number {
  const distance = calculateTotalDistance(waypoints);
  const drivingTime = (distance / averageSpeed) * 60; // Minutes
  
  // Add stop durations
  const stopTime = waypoints.reduce((total, waypoint) => {
    return total + (waypoint.stopDuration || 0);
  }, 0);

  return Math.round(drivingTime + stopTime);
}

/**
 * Calculate estimated fuel consumption for a route
 */
export function estimateFuelConsumption(
  distance: number,
  vehicleType: VehicleType = 'car'
): number {
  const consumptionRate = FUEL_CONSUMPTION_RATES[vehicleType];
  return (distance * consumptionRate) / 100;
}

/**
 * Calculate route cost breakdown
 */
export function calculateRouteCost(
  route: Route,
  vehicleType: VehicleType = 'car',
  durationMinutes?: number
): RouteCostAnalysis {
  const distance = route.distance;
  const duration = durationMinutes || estimateRouteDuration(parseRoutePath(route.path));
  const durationHours = duration / 60;

  const fuelConsumption = estimateFuelConsumption(distance, vehicleType);
  const fuelCost = fuelConsumption * COST_FACTORS.FUEL_PRICE_PER_LITER;
  
  const driverCost = durationHours * COST_FACTORS.DRIVER_COST_PER_HOUR;
  const vehicleWearCost = distance * COST_FACTORS.VEHICLE_COST_PER_KM;
  const tollCost = distance * COST_FACTORS.TOLL_AVERAGE_PER_KM;
  const timeCost = durationHours * COST_FACTORS.TIME_VALUE_PER_HOUR;

  const totalCost = fuelCost + driverCost + vehicleWearCost + tollCost + timeCost;

  return {
    routeId: route.id,
    fuelCost,
    tollCost,
    driverCost,
    vehicleWearCost,
    timeCost,
    totalCost,
    costPerKm: totalCost / distance,
    currency: 'USD',
    calculatedAt: new Date().toISOString(),
  };
}

/**
 * Check if a location is within waypoint completion radius
 */
export function isWithinWaypointRadius(
  currentLat: number,
  currentLng: number,
  waypointLat: number,
  waypointLng: number,
  radiusMeters: number = ROUTE_TOLERANCES.WAYPOINT_RADIUS_METERS
): boolean {
  const distance = calculateDistance(currentLat, currentLng, waypointLat, waypointLng);
  return distance * 1000 <= radiusMeters; // Convert km to meters
}

/**
 * Calculate route progress percentage
 */
export function calculateRouteProgress(
  waypoints: RouteWaypoint[],
  currentPosition: { latitude: number; longitude: number }
): {
  progress: number; // 0-100 percentage
  nextWaypointIndex: number;
  distanceToNext: number;
  estimatedTimeToNext: number;
} {
  if (waypoints.length === 0) {
    return { progress: 0, nextWaypointIndex: 0, distanceToNext: 0, estimatedTimeToNext: 0 };
  }

  // Find the closest waypoint that hasn't been completed
  let nextWaypointIndex = waypoints.findIndex(wp => !wp.isCompleted);
  if (nextWaypointIndex === -1) {
    return { progress: 100, nextWaypointIndex: waypoints.length - 1, distanceToNext: 0, estimatedTimeToNext: 0 };
  }

  const nextWaypoint = waypoints[nextWaypointIndex];
  const distanceToNext = calculateDistance(
    currentPosition.latitude,
    currentPosition.longitude,
    nextWaypoint.latitude,
    nextWaypoint.longitude
  );

  // Calculate total route distance and completed distance
  const totalDistance = calculateTotalDistance(waypoints);
  let completedDistance = 0;

  // Add distances of completed segments
  for (let i = 1; i < nextWaypointIndex; i++) {
    const prev = waypoints[i - 1];
    const curr = waypoints[i];
    completedDistance += calculateDistance(prev.latitude, prev.longitude, curr.latitude, curr.longitude);
  }

  // Add distance from last completed waypoint to current position
  if (nextWaypointIndex > 0) {
    const lastCompleted = waypoints[nextWaypointIndex - 1];
    completedDistance += calculateDistance(
      lastCompleted.latitude,
      lastCompleted.longitude,
      currentPosition.latitude,
      currentPosition.longitude
    );
  }

  const progress = totalDistance > 0 ? (completedDistance / totalDistance) * 100 : 0;
  const estimatedTimeToNext = (distanceToNext / ROUTE_LIMITS.DEFAULT_SPEED_KMH) * 60; // Minutes

  return {
    progress: Math.min(100, Math.max(0, progress)),
    nextWaypointIndex,
    distanceToNext,
    estimatedTimeToNext,
  };
}

/**
 * Validate route data
 */
export function validateRoute(waypoints: RouteWaypoint[]): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (waypoints.length < 2) {
    errors.push('Route must have at least 2 waypoints (start and destination)');
  }

  if (waypoints.length > ROUTE_LIMITS.MAX_WAYPOINTS) {
    errors.push(`Route cannot have more than ${ROUTE_LIMITS.MAX_WAYPOINTS} waypoints`);
  }

  const totalDistance = calculateTotalDistance(waypoints);
  if (totalDistance > ROUTE_LIMITS.MAX_DISTANCE_KM) {
    errors.push(`Route distance (${totalDistance.toFixed(1)}km) exceeds maximum (${ROUTE_LIMITS.MAX_DISTANCE_KM}km)`);
  }

  if (totalDistance < ROUTE_LIMITS.MIN_DISTANCE_KM) {
    warnings.push(`Route distance (${totalDistance.toFixed(1)}km) is very short`);
  }

  // Check for duplicate coordinates
  const duplicates = waypoints.filter((wp, index) => 
    waypoints.findIndex(other => 
      Math.abs(other.latitude - wp.latitude) < 0.0001 && 
      Math.abs(other.longitude - wp.longitude) < 0.0001
    ) !== index
  );

  if (duplicates.length > 0) {
    warnings.push('Route contains duplicate waypoints');
  }

  // Check waypoint order
  const hasCorrectOrder = waypoints.every((wp, index) => wp.order === index);
  if (!hasCorrectOrder) {
    warnings.push('Waypoint order indices do not match array positions');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Generate route summary text
 */
export function generateRouteSummary(route: Route): string {
  const waypoints = parseRoutePath(route.path);
  const duration = estimateRouteDuration(waypoints);
  
  return `${waypoints.length} waypoints, ${route.distance.toFixed(1)}km, ~${Math.round(duration)}min`;
}

/**
 * Find optimal waypoint order (simplified TSP solution)
 */
export function optimizeWaypointOrder(
  waypoints: RouteWaypoint[],
  startIndex: number = 0
): RouteWaypoint[] {
  if (waypoints.length <= 2) return waypoints;

  // Keep start and end fixed, optimize middle waypoints
  const start = waypoints[startIndex];
  const end = waypoints[waypoints.length - 1];
  const middle = waypoints.slice(1, -1);

  // Simple nearest neighbor algorithm for optimization
  const optimized = [start];
  const remaining = [...middle];
  let current = start;

  while (remaining.length > 0) {
    let nearestIndex = 0;
    let shortestDistance = Infinity;

    remaining.forEach((waypoint, index) => {
      const distance = calculateDistance(
        current.latitude, current.longitude,
        waypoint.latitude, waypoint.longitude
      );
      if (distance < shortestDistance) {
        shortestDistance = distance;
        nearestIndex = index;
      }
    });

    const nearest = remaining.splice(nearestIndex, 1)[0];
    optimized.push(nearest);
    current = nearest;
  }

  optimized.push(end);

  // Update order indices
  return optimized.map((waypoint, index) => ({
    ...waypoint,
    order: index,
  }));
}
