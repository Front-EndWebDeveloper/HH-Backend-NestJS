export class ErrorSerializer {
  statusCode: number;
  message: string;
  errors?: any;
  timestamp: string;

  constructor(partial: Partial<ErrorSerializer>) {
    Object.assign(this, partial);
    this.timestamp = new Date().toISOString();
  }
}

