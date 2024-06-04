export interface PaginationDto {
  page: number;
  pageSize: number;
}

export enum DeleteStatus {
  Active = 0,
  Delete = 1,
}
