import { CreateAlertRequest } from '../../../types/requests/alert';
import { ALERT_VALIDATION, ALERT_VALIDATION_ERRORS } from '../../../types/requests/alert/validation';
import { AlertType } from '../../../types/enums';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export class AlertValidationService {
  /**
   * Validate create alert request
   */
  static validateCreateAlert(request: CreateAlertRequest): ValidationResult {
    const errors: string[] = [];

    // Validate vehicleId
    if (!request.vehicleId) {
      errors.push(ALERT_VALIDATION_ERRORS.VEHICLE_ID_REQUIRED);
    } else if (request.vehicleId.length < ALERT_VALIDATION.vehicleId.minLength) {
      errors.push(ALERT_VALIDATION_ERRORS.VEHICLE_ID_TOO_SHORT);
    } else if (request.vehicleId.length > ALERT_VALIDATION.vehicleId.maxLength) {
      errors.push(ALERT_VALIDATION_ERRORS.VEHICLE_ID_TOO_LONG);
    }

    // Validate message
    if (!request.message) {
      errors.push(ALERT_VALIDATION_ERRORS.MESSAGE_REQUIRED);
    } else if (request.message.length < ALERT_VALIDATION.message.minLength) {
      errors.push(ALERT_VALIDATION_ERRORS.MESSAGE_TOO_SHORT);
    } else if (request.message.length > ALERT_VALIDATION.message.maxLength) {
      errors.push(ALERT_VALIDATION_ERRORS.MESSAGE_TOO_LONG);
    }

    // Validate alert type
    if (!Object.values(AlertType).includes(request.type)) {
      errors.push(ALERT_VALIDATION_ERRORS.INVALID_TYPE);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Sanitize alert message
   */
  static sanitizeMessage(message: string): string {
    return message
      .trim()
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .substring(0, ALERT_VALIDATION.message.maxLength);
  }

  /**
   * Validate vehicleId format
   */
  static isValidVehicleId(vehicleId: string): boolean {
    // Vehicle ID should be alphanumeric with possible hyphens
    const vehicleIdRegex = /^[a-zA-Z0-9\-]+$/;
    return vehicleIdRegex.test(vehicleId) && 
           vehicleId.length >= ALERT_VALIDATION.vehicleId.minLength &&
           vehicleId.length <= ALERT_VALIDATION.vehicleId.maxLength;
  }
}

export default AlertValidationService;
