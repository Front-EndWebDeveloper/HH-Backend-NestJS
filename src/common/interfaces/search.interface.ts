export interface SearchInterface {
  query?: string;
  filters?: Record<string, any>;
  sort?: {
    field: string;
    order: 'ASC' | 'DESC';
  };
  pagination?: {
    page: number;
    limit: number;
  };
}

