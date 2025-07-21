/**
 * Alert entity types for fleet monitoring system
 * Simplified to match backend AlertDto
 */

export interface Alert {
  vehicleId: string;
  type: string;
  message: string;
}
export * from './utils';
