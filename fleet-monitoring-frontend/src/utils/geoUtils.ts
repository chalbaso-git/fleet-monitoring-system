import { GPSCoordinate } from '@/types';

/**
 * Calculate distance between two GPS coordinates using Haversine formula
 * @param point1 First GPS coordinate
 * @param point2 Second GPS coordinate
 * @returns Distance in kilometers
 */
export const calculateDistance = (point1: GPSCoordinate, point2: GPSCoordinate): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(point2.latitude - point1.latitude);
  const dLon = toRadians(point2.longitude - point1.longitude);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(point1.latitude)) *
      Math.cos(toRadians(point2.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Convert degrees to radians
 */
const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

/**
 * Convert radians to degrees
 */
export const toDegrees = (radians: number): number => {
  return radians * (180 / Math.PI);
};

/**
 * Calculate bearing between two GPS coordinates
 * @param point1 Start point
 * @param point2 End point
 * @returns Bearing in degrees
 */
export const calculateBearing = (point1: GPSCoordinate, point2: GPSCoordinate): number => {
  const dLon = toRadians(point2.longitude - point1.longitude);
  const lat1 = toRadians(point1.latitude);
  const lat2 = toRadians(point2.latitude);
  
  const y = Math.sin(dLon) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  
  const bearing = toDegrees(Math.atan2(y, x));
  return (bearing + 360) % 360;
};

/**
 * Check if GPS coordinates are valid
 */
export const isValidCoordinate = (coordinate: GPSCoordinate): boolean => {
  const { latitude, longitude } = coordinate;
  return (
    typeof latitude === 'number' &&
    typeof longitude === 'number' &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
};

/**
 * Format coordinates for display
 */
export const formatCoordinate = (coordinate: GPSCoordinate): string => {
  return `${coordinate.latitude.toFixed(6)}, ${coordinate.longitude.toFixed(6)}`;
};

/**
 * Check if point is within radius of center
 */
export const isWithinRadius = (
  center: GPSCoordinate,
  point: GPSCoordinate,
  radiusKm: number
): boolean => {
  const distance = calculateDistance(center, point);
  return distance <= radiusKm;
};
