import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GalleryImage } from '../../database/entities/gallery-image.entity';
import { CreateGalleryImageDto } from './dto/create-gallery-image.dto';
import { UpdateGalleryImageDto } from './dto/update-gallery-image.dto';

@Injectable()
export class GalleryService {
  constructor(
    @InjectRepository(GalleryImage)
    private readonly galleryRepository: Repository<GalleryImage>,
  ) {}

  async findAll(serviceId?: string): Promise<GalleryImage[]> {
    const queryBuilder = this.galleryRepository
      .createQueryBuilder('image')
      .where('image.visible = :visible', { visible: true })
      .orderBy('image.order', 'ASC');

    if (serviceId) {
      queryBuilder.andWhere('image.serviceId = :serviceId', { serviceId });
    }

    return queryBuilder.getMany();
  }

  async create(createGalleryImageDto: CreateGalleryImageDto): Promise<GalleryImage> {
    const image = this.galleryRepository.create(createGalleryImageDto);
    return this.galleryRepository.save(image);
  }

  async update(id: string, updateGalleryImageDto: UpdateGalleryImageDto): Promise<GalleryImage> {
    const image = await this.galleryRepository.findOne({ where: { id } });
    Object.assign(image, updateGalleryImageDto);
    return this.galleryRepository.save(image);
  }

  async remove(id: string): Promise<void> {
    await this.galleryRepository.delete(id);
  }
}
