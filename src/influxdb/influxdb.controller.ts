import { Body, Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { InfluxdbService } from './influxdb.service';
import { FindShortCodeDataDto } from './dto/influxdb-dto';
import { BasicResponse } from 'src/common/types/common.type';
import { ShortCodeTimeDataVo } from './vo/influxdb-vo';

@Controller()
export class InfluxdbController {
  constructor(private readonly influxdbService: InfluxdbService) { }

  @Post('shortCodeTimeData/list')
  async getMonthData(@Body() body: FindShortCodeDataDto): BasicResponse<ShortCodeTimeDataVo[]> {
    try {
      const data = await this.influxdbService.findVisitRecord(body);
      console.log('data', data, data.length);
      return {
        data,
        code: HttpStatus.OK,
        message: 'success'
      };
    } catch (error) {
      return {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error || 'Failed to create short link',
      };
    }
  }
}
