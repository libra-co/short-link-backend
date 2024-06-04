import { Controller } from '@nestjs/common';
import { InfluxdbService } from './influxdb.service';

@Controller('influxdb')
export class InfluxdbController {
  constructor(private readonly influxdbService: InfluxdbService) {}
}
