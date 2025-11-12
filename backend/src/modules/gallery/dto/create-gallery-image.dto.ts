import { IsString, IsBoolean, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class CreateGalleryImageDto {
  @IsString()
  url: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  alt?: string;

  @IsNumber()
  @IsOptional()
  order?: number;

  @IsBoolean()
  @IsOptional()
  visible?: boolean;

  @IsUUID()
  @IsOptional()
  serviceId?: string;
}
