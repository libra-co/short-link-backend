import { InfluxDBRangeTypeEnum } from "../influxdb.type";

export class FindShortCodeDataDto {
  rangeType: InfluxDBRangeTypeEnum;
  shortCodeId?: number;
}
