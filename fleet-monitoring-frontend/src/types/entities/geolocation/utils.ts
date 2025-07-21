import { GpsCoordinate, VehicleLocation } from './index';
import { GPS_BOUNDS, MOVEMENT_THRESHOLDS, GPS_ACCURACY_LEVELS } from './constants';

/**
 * Validates GPS coordinates
 */
export function validateGpsCoordinates(latitude: number, longitude: number): boolean {
  return (
    latitude >= GPS_BOUNDS.LATITUDE.MIN &&
    latitude <= GPS_BOUNDS.LATITUDE.MAX &&
    longitude >= GPS_BOUNDS.LONGITUDE.MIN &&
    longitude <= GPS_BOUNDS.LONGITUDE.MAX
  );
}

/**
 * Calculates the distance between two GPS coordinates using Haversine formula
 * @param coord1 First GPS coordinate
 * @param coord2 Second GPS coordinate
 * @returns Distance in kilometers
 */
export function calculateDistance(
  coord1: { latitude: number; longitude: number },
  coord2: { latitude: number; longitude: number }
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(coord2.latitude - coord1.latitude);
  const dLon = toRadians(coord2.longitude - coord1.longitude);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(coord1.latitude)) *
      Math.cos(toRadians(coord2.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Converts degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Calculates speed between two GPS coordinates
 * @param coord1 Previous coordinate with timestamp
 * @param coord2 Current coordinate with timestamp
 * @returns Speed in km/h
 */
export function calculateSpeed(coord1: GpsCoordinate, coord2: GpsCoordinate): number {
  const distance = calculateDistance(coord1, coord2);
  const timeDiff = (new Date(coord2.timestamp).getTime() - new Date(coord1.timestamp).getTime()) / (1000 * 3600); // hours
  
  if (timeDiff <= 0) return 0;
  return distance / timeDiff;
}

/**
 * Determines if a vehicle is moving based on speed threshold
 */
export function isVehicleMoving(speed: number): boolean {
  return speed > MOVEMENT_THRESHOLDS.STATIONARY_SPEED;
}

/**
 * Calculates bearing (direction) between two GPS coordinates
 * @param coord1 Start coordinate
 * @param coord2 End coordinate
 * @returns Bearing in degrees (0-360)
 */
export function calculateBearing(
  coord1: { latitude: number; longitude: number },
  coord2: { latitude: number; longitude: number }
): number {
  const dLon = toRadians(coord2.longitude - coord1.longitude);
  const lat1 = toRadians(coord1.latitude);
  const lat2 = toRadians(coord2.latitude);
  
  const y = Math.sin(dLon) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  
  let bearing = Math.atan2(y, x);
  bearing = (bearing * 180) / Math.PI;
  return (bearing + 360) % 360;
}

/**
 * Formats coordinates for display
 */
export function formatCoordinates(latitude: number, longitude: number, precision: number = 6): string {
  return `${latitude.toFixed(precision)}, ${longitude.toFixed(precision)}`;
}

/**
 * Determines GPS accuracy level based on accuracy value
 */
export function getGpsAccuracyLevel(accuracy: number): 'high' | 'medium' | 'low' {
  if (accuracy <= GPS_ACCURACY_LEVELS.HIGH) return 'high';
  if (accuracy <= GPS_ACCURACY_LEVELS.MEDIUM) return 'medium';
  return 'low';
}

/**
 * Checks if two coordinates are essentially the same (within tolerance)
 */
export function areCoordinatesEqual(
  coord1: { latitude: number; longitude: number },
  coord2: { latitude: number; longitude: number },
  tolerance: number = MOVEMENT_THRESHOLDS.GPS_UPDATE_TOLERANCE
): boolean {
  return (
    Math.abs(coord1.latitude - coord2.latitude) < tolerance &&
    Math.abs(coord1.longitude - coord2.longitude) < tolerance
  );
}

/**
 * Creates a bounding box around a center point
 */
export function createBoundingBox(
  center: { latitude: number; longitude: number },
  radiusKm: number
): {
  north: number;
  south: number;
  east: number;
  west: number;
} {
  const earthRadius = 6371; // km
  const latDelta = (radiusKm / earthRadius) * (180 / Math.PI);
  const lonDelta = latDelta / Math.cos(toRadians(center.latitude));
  
  return {
    north: center.latitude + latDelta,
    south: center.latitude - latDelta,
    east: center.longitude + lonDelta,
    west: center.longitude - lonDelta,
  };
}

/**
 * Validates if a coordinate is within a circular geofence
 */
export function isWithinCircularGeofence(
  coordinate: { latitude: number; longitude: number },
  center: { latitude: number; longitude: number },
  radiusMeters: number
): boolean {
  const distanceKm = calculateDistance(coordinate, center);
  return distanceKm * 1000 <= radiusMeters;
}

/**
 * Gets the center point of multiple coordinates
 */
export function getCenterPoint(coordinates: Array<{ latitude: number; longitude: number }>): {
  latitude: number;
  longitude: number;
} {
  if (coordinates.length === 0) {
    throw new Error('Cannot calculate center of empty coordinates array');
  }
  
  const sum = coordinates.reduce(
    (acc, coord) => ({
      latitude: acc.latitude + coord.latitude,
      longitude: acc.longitude + coord.longitude,
    }),
    { latitude: 0, longitude: 0 }
  );
  
  return {
    latitude: sum.latitude / coordinates.length,
    longitude: sum.longitude / coordinates.length,
  };
}
