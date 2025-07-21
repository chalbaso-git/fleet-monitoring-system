import { BaseEntity } from '../../common';
import { AlertType } from '../../enums';

// Main Alert entity
export interface Alert extends BaseEntity {
  vehicleId: string;
  type: AlertType;
  message: string;
}

// Extended Alert with computed properties
export interface AlertWithMetadata extends Alert {
  severity: string;
  isRecent: boolean;
  relativeTime: string;
  vehicleName?: string;
}

// Export all alert-related types and utilities
export * from './constants';
export * from './utils';
