/**
 * Vehicle entity types for fleet monitoring system
 * Matches backend VehicleDto exactly
 */
export interface Vehicle {
  id: string;
  name: string;
  licensePlate: string;
  model: string;
  year: number;
  status: string; // "active", "inactive", "maintenance", "offline"
  lastLocation: string;
  lastSeen: string; // DateTime from backend as ISO string
}

export default Vehicle;
