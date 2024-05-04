import {
  VisitorBrowserType,
  VisitorDeviceType,
  VisitorOsType,
} from 'src/short-link/short-link.type';

export class CreateVisitRecordDto {
  visitorOsType: VisitorOsType;
  visitorBrowserType: VisitorBrowserType;
  visitorDeviceType: VisitorDeviceType;
  userAgent: string;
}
