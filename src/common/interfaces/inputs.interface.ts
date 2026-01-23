export interface PaginationInput {
  page?: number;
  limit?: number;
}

export interface SortInput {
  field: string;
  order: 'ASC' | 'DESC';
}

export interface FilterInput {
  field: string;
  operator: string;
  value: any;
}

