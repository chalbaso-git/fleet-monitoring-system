import { AlertType } from '../../enums';

// Request to create a new alert
export interface CreateAlertRequest {
  vehicleId: string;
  type: AlertType;
  message: string;
  createdAt?: string;
}

// Request to update an alert
export interface UpdateAlertRequest extends Partial<CreateAlertRequest> {
  id: number;
}

// Export all alert request-related types
export * from './validation';
