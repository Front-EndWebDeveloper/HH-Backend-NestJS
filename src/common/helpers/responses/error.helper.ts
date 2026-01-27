export class ErrorHelper {
  static createErrorResponse(message: string, statusCode: number, errors?: any) {
    return {
      success: false,
      statusCode,
      message,
      errors: errors || {},
      timestamp: new Date().toISOString(),
    };
  }
}
