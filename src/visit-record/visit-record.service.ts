import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateVisitRecordParams, UrlAccessStatusEnum } from './visit-record.type';
import { VisitRecord } from './entities/link-record.entity';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, } from 'typeorm';
import { ShortCodeStatus, VisitType } from 'src/short-link/short-link.type';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { ShortCode } from 'src/short-link/entities/short-link.entity';
import { CreateVisitRecordVo, GetIpLocationVo } from './vo/visit-record.vo';
import { BasicResponse } from 'src/common/types/common.type';

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
    let country, province, city, isp;
    try {
      const res = await this.getIpLocation(ip);
      country = res.country,
        province = res.province,
        city = res.city,
        isp = res.isp
    } catch (error) {
      console.error('error', error)
    }
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

  async getIpLocation(ip: string): Promise<GetIpLocationVo> {
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
    throw new Error(data.data.msg)
  }

  async getShortCodeVisitDetailById(shortCodeId: number) {
    if (!shortCodeId) throw new Error('Short code not found')
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

    return { data, total }
  }

  async updateFailedAccessRecord(id: number) {
    const record = await this.entityManager.findOneBy(VisitRecord, { id });
    if (!record) return null;
    record.accessFailed = UrlAccessStatusEnum.FAIL;
    return await this.entityManager.save(record);
  }
}
