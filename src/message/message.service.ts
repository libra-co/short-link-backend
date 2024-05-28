import { Inject, Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';

@Injectable()
export class MessageService {

  @InjectEntityManager()
  private readonly entityManager: EntityManager;

  generateMessage(createMessageDto: CreateMessageDto) {
    const { linkRecordId, shortCodeId, shortCode, type, content, } = createMessageDto;
    const message = new Message();
    message.content = content;
    message.linkRecordId = linkRecordId;
    message.shortCodeId = shortCodeId;
    message.shortCode = shortCode;
    message.type = type;
    return message;
  }

  findAll() {
    return `This action returns all message`;
  }

  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }


  async createMessage(createMessageDto: Message) {
    console.log('123', 123);
    console.log('createMessageDto', createMessageDto);
    return await this.entityManager.save(Message, createMessageDto);
  }
}
