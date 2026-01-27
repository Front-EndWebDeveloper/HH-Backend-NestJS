export class QueryHelper {
  static parsePage(page?: string | number): number {
    const parsed = typeof page === 'string' ? parseInt(page, 10) : page || 1;
    return isNaN(parsed) || parsed < 1 ? 1 : parsed;
  }

  static parseLimit(limit?: string | number, maxLimit: number = 100): number {
    const parsed = typeof limit === 'string' ? parseInt(limit, 10) : limit || 10;
    return isNaN(parsed) || parsed < 1 ? 10 : parsed > maxLimit ? maxLimit : parsed;
  }

  static getSkip(page: number, limit: number): number {
    return (page - 1) * limit;
  }
}
