import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { GalleryImage } from './gallery-image.entity';

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  slug: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column('text')
  content: string;

  @Column({ nullable: true })
  icon: string;

  @Column()
  image: string;

  @Column({ default: false })
  featured: boolean;

  @Column({ default: 0 })
  order: number;

  @Column({ nullable: true })
  metaTitle: string;

  @Column('text', { nullable: true })
  metaDescription: string;

  @Column({ default: true })
  published: boolean;

  @OneToMany(() => GalleryImage, (image) => image.service)
  galleryImages: GalleryImage[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
