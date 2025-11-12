import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Service } from './service.entity';

@Entity('gallery_images')
export class GalleryImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  url: string;

  @Column({ nullable: true })
  title: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({ nullable: true })
  alt: string;

  @Column({ default: 0 })
  order: number;

  @Column({ default: true })
  visible: boolean;

  @Column({ nullable: true })
  serviceId: string;

  @ManyToOne(() => Service, (service) => service.galleryImages, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'serviceId' })
  service: Service;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
