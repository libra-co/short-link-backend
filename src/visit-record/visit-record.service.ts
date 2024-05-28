import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateVisitRecordParams, UrlAccessStatusEnum } from './visit-record.type';
import { VisitRecord } from './entities/link-record.entity';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Code, EntityManager, ReturningStatementNotSupportedError } from 'typeorm';
import { ShortCodeStatus, VisitType } from 'src/short-link/short-link.type';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { ShortCode } from 'src/short-link/entities/short-link.entity';
import { MessageService } from 'src/message/message.service';

@Injectable()
export class VisitRecordService {
  constructor(
    private readonly httpService: HttpService,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) { }

  async genVisitRecord(createVisitRecordDto: CreateVisitRecordParams) {
    const {
      ip,
      shortCodeId,
      visitorDeviceType,
      visitorBrowserType,
      visitorOsType,
      userAgent,
      referer,
    } = createVisitRecordDto;
    const isFirstVisit = await this.entityManager.findOneBy(VisitRecord, {
      shortCodeId,
      ip,
    });
    const { country, province, city, isp } = await this.getIpLocation(ip);
    const visitRecord = new VisitRecord();
    visitRecord.ip = ip;
    visitRecord.shortCodeId = shortCodeId;
    visitRecord.visitType = isFirstVisit ? VisitType.FIRST : VisitType.REPEAT;
    visitRecord.visitorDeviceType = visitorDeviceType;
    visitRecord.visitorBrowserType = visitorBrowserType;
    visitRecord.visitorOsType = visitorOsType;
    visitRecord.userAgent = userAgent;
    visitRecord.referer = referer;
    visitRecord.country = country;
    visitRecord.province = province;
    visitRecord.city = city;
    visitRecord.isp = isp;
    return visitRecord;
  }

  async createVisitRecord(visitRecord: VisitRecord): Promise<VisitRecord | null> {
    const shortCode = await this.entityManager.findOneBy(ShortCode, {
      id: visitRecord.shortCodeId,
      status: ShortCodeStatus.ENABLE,
    });
    if (!shortCode) return null;

    if (shortCode.visitLimit > 0) {
      if (shortCode.visitLimit === 1) {
        shortCode.status = ShortCodeStatus.DISABLE;
      }
      shortCode.visitLimit -= 1;
    }

    try {
      const recordEntity = await this.entityManager.transaction(
        async (transactionalEntityManager) => {
          const recordEntity = await transactionalEntityManager.save(visitRecord);
          if (shortCode.visitLimit > 0) {
            await transactionalEntityManager.save(shortCode);
          }
          return recordEntity;
        },
      );
      return recordEntity;
    } catch (error) {
      console.error(this.createVisitRecord.name, 'error', error);
      return null;
    }
  }

  findAll() {
    return `This action returns all visitRecord`;
  }

  findOne(id: number) {
    return `This action returns a #${id} visitRecord`;
  }

  remove(id: number) {
    return `This action removes a #${id} visitRecord`;
  }

  async getIpLocation(ip: string) {
    const queryUrl = `https://searchplugin.csdn.net/api/v1/ip/get?ip=${ip}`;
    const data = (await firstValueFrom(
      this.httpService.get(queryUrl).pipe(
        catchError((error) => {
          console.error('error', error.response.data);
          throw new Error('Failed to get ip location');
        }),
      ),
    ));
    if (data.status === 200) {
      const address = data?.data?.data?.address;
      if (address) {
        const [country, province, city, isp] = address.split(' ');
        return { country, province, city, isp };
      };
    }
    console.error(data.data.msg);
    return {};
  }

  async getShortCodeVisitDetailById(shortCodeId: number) {
    if (!shortCodeId)
      return {
        code: HttpStatus.BAD_REQUEST,
        message: 'Short code not found',
      };
    const [data, total] = await this.entityManager.findAndCount(VisitRecord, {
      where: { shortCodeId },
      select: [
        'id',
        'ip',
        'visitTime',
        'visitType',
        'visitorDeviceType',
        'visitorBrowserType',
        'visitorOsType',
        'referer',
        'country',
        'province',
        'city',
        'isp',
      ],
    });
    return {
      data: { data, total },
      message: 'Visit detail fetched successfully',
      code: HttpStatus.OK,
    };
  }

  async updateFailedAccessRecord(id: number) {
    const record = await this.entityManager.findOneBy(VisitRecord, { id });
    if (!record) return null;
    record.accessFailed = UrlAccessStatusEnum.FAIL;
    return await this.entityManager.save(record);
  }
}
