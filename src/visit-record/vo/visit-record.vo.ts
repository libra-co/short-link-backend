import {
  VisitorBrowserType,
  VisitorDeviceType,
  VisitorOsType,
} from 'src/short-link/short-link.type';
import { UrlAccessStatusEnum } from '../visit-record.type';
import { VisitRecord } from '../entities/link-record.entity';

export class CreateVisitRecordVo {
  visitorOsType: VisitorOsType;
  visitorBrowserType: VisitorBrowserType;
  visitorDeviceType: VisitorDeviceType;
  userAgent: string;
  accessFailed: UrlAccessStatusEnum;
}

export interface GetIpLocationVo {
  country: string,
  province: string,
  city: string,
  isp: string,
}

export interface GetShortCodeVisitDetailByIdVo {
  data: VisitRecord[],
  total: number;
}

export interface GetDashBoardDataVo {
  day: number;
  month: number;
  year: number;
}

export interface GetShortCodeCountStatisticsVo {
  totalCount: number;
  availableCount: number;
}
