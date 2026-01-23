export class SuccessSerializer {
  success: boolean;
  statusCode: number;
  message: string;
  data?: any;
  timestamp: string;

  constructor(partial: Partial<SuccessSerializer>) {
    Object.assign(this, {
      success: true,
      statusCode: 200,
      ...partial,
    });
    this.timestamp = new Date().toISOString();
  }
}

