import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactSubmission } from '../../database/entities/contact-submission.entity';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(ContactSubmission)
    private readonly contactRepository: Repository<ContactSubmission>,
  ) {}

  async create(createContactDto: CreateContactDto): Promise<ContactSubmission> {
    const contact = this.contactRepository.create(createContactDto);
    return this.contactRepository.save(contact);
  }

  async findAll(): Promise<ContactSubmission[]> {
    return this.contactRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<ContactSubmission> {
    return this.contactRepository.findOne({ where: { id } });
  }

  async updateStatus(id: string, status: string): Promise<ContactSubmission> {
    const contact = await this.findOne(id);
    contact.status = status as any;
    return this.contactRepository.save(contact);
  }

  async remove(id: string): Promise<void> {
    await this.contactRepository.delete(id);
  }
}
