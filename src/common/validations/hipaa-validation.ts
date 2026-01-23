import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

// HIPAA Compliance Validations
@ValidatorConstraint({ name: 'hipaaCompliantPassword', async: false })
export class HipaaCompliantPassword implements ValidatorConstraintInterface {
  validate(password: string): boolean {
    // HIPAA requires strong passwords
    const minLength = 12;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return (
      password.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumbers &&
      hasSpecialChar
    );
  }

  defaultMessage(): string {
    return 'Password must be at least 12 characters long and contain uppercase, lowercase, numbers, and special characters';
  }
}

