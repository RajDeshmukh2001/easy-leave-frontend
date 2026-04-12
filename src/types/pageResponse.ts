export type PageResponse<T> = {
  content: T[];
  last: boolean;
  first: boolean;
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
};
