import { HttpStatus } from "@nestjs/common";

export interface PaginationInterface {
  page: number;
  pageSize: number;
}

export enum DeleteStatus {
  Active = 0,
  Delete = 1,
}

export interface BasicResponseInterface<Vo = unknown> {
  data?: Vo,
  code: HttpStatus,
  message: string
}

export type BasicResponse<Vo = unknown> = Promise<BasicResponseInterface<Vo>>
