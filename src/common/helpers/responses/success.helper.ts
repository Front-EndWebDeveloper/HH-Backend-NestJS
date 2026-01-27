export class SuccessHelper {
  static createSuccessResponse(data: any, message?: string) {
    return {
      success: true,
      statusCode: 200,
      message: message || 'Operation successful',
      data,
      timestamp: new Date().toISOString(),
    };
  }

  static createPaginatedResponse(data: any[], total: number, page: number, limit: number) {
    return {
      success: true,
      statusCode: 200,
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      timestamp: new Date().toISOString(),
    };
  }
}
