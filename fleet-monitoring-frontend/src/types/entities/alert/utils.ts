import { AlertSeverity } from '../../enums';
import { Alert } from './index';

// Alert utilities and computed properties
export interface AlertUtils {
  getSeverity(alert: Alert): AlertSeverity;
  formatMessage(alert: Alert): string;
  isRecent(alert: Alert, minutes?: number): boolean;
  getIcon(alertType: string): string;
  getColor(severity: AlertSeverity): string;
}

// Alert sorting options
export enum AlertSortBy {
  CREATED_AT = 'createdAt',
  TYPE = 'type',
  VEHICLE_ID = 'vehicleId',
  SEVERITY = 'severity',
}

// Alert grouping options
export enum AlertGroupBy {
  TYPE = 'type',
  VEHICLE = 'vehicleId',
  DATE = 'date',
  SEVERITY = 'severity',
}

// Alert time periods for filtering
export enum AlertTimePeriod {
  LAST_HOUR = '1h',
  LAST_24_HOURS = '24h',
  LAST_WEEK = '7d',
  LAST_MONTH = '30d',
  CUSTOM = 'custom',
}
