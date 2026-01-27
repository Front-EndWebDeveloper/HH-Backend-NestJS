import { ValidationError } from 'class-validator';

export class ValidationHelper {
  static formatErrors(errors: ValidationError[]): Record<string, string[]> {
    const formatted: Record<string, string[]> = {};

    errors.forEach((error) => {
      if (error.constraints) {
        formatted[error.property] = Object.values(error.constraints);
      }

      if (error.children && error.children.length > 0) {
        const childErrors = this.formatErrors(error.children);
        Object.assign(formatted, childErrors);
      }
    });

    return formatted;
  }
}
