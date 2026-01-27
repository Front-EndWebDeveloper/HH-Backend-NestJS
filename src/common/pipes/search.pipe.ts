import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { SearchInterface } from '../interfaces/search.interface';

@Injectable()
export class SearchPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): SearchInterface {
    return {
      query: value.query || '',
      filters: value.filters || {},
      sort: value.sort || { field: 'id', order: 'ASC' },
      pagination: {
        page: parseInt(value.page, 10) || 1,
        limit: parseInt(value.limit, 10) || 10,
      },
    };
  }
}
