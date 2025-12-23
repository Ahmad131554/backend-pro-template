/**
 * Pagination utility functions
 */

export interface PaginationOptions {
  page?: number;
  limit?: number;
  maxLimit?: number;
}

export interface PaginationResult {
  page: number;
  limit: number;
  skip: number;
  total?: number;
  pages?: number;
}

/**
 * Calculate pagination parameters
 */
export const calculatePagination = (options: PaginationOptions): PaginationResult => {
  const { page = 1, limit = 10, maxLimit = 100 } = options;
  
  // Ensure valid page number
  const validPage = Math.max(1, Math.floor(page));
  
  // Ensure valid limit within max bounds
  const validLimit = Math.min(Math.max(1, Math.floor(limit)), maxLimit);
  
  // Calculate skip value
  const skip = (validPage - 1) * validLimit;
  
  return {
    page: validPage,
    limit: validLimit,
    skip
  };
};

/**
 * Add total count and pages to pagination result
 */
export const addPaginationMeta = (
  pagination: PaginationResult,
  total: number
): Required<PaginationResult> => {
  const pages = Math.ceil(total / pagination.limit);
  
  return {
    ...pagination,
    total,
    pages
  };
};

/**
 * Extract pagination from query parameters
 */
export const extractPaginationFromQuery = (query: any): PaginationOptions => {
  return {
    page: query.page ? parseInt(query.page as string, 10) : undefined,
    limit: query.limit ? parseInt(query.limit as string, 10) : undefined
  };
};