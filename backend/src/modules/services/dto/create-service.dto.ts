import { IsString, IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class CreateServiceDto {
  @IsString()
  slug: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  content: string;

  @IsString()
  @IsOptional()
  icon?: string;

  @IsString()
  image: string;

  @IsBoolean()
  @IsOptional()
  featured?: boolean;

  @IsNumber()
  @IsOptional()
  order?: number;

  @IsString()
  @IsOptional()
  metaTitle?: string;

  @IsString()
  @IsOptional()
  metaDescription?: string;

  @IsBoolean()
  @IsOptional()
  published?: boolean;
}
