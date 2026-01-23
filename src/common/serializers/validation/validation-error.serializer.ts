export class ValidationErrorSerializer {
  statusCode: number;
  message: string;
  errors: Record<string, string[]>;
  timestamp: string;

  constructor(partial: Partial<ValidationErrorSerializer>) {
    Object.assign(this, {
      statusCode: 400,
      message: 'Validation failed',
      ...partial,
    });
    this.timestamp = new Date().toISOString();
  }
}

