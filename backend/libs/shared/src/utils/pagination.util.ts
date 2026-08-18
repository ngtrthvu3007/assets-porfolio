import { PaginationResponseDto } from '../dto/pagination.dto';

export const buildPaginationMeta = (
  page: number,
  pageSize: number,
  total: number,
): PaginationResponseDto => {
  return { page, pageSize, total, totalPages: Math.ceil(total / pageSize) };
};
