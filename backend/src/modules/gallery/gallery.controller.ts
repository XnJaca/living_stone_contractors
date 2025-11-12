import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { GalleryService } from './gallery.service';
import { CreateGalleryImageDto } from './dto/create-gallery-image.dto';
import { UpdateGalleryImageDto } from './dto/update-gallery-image.dto';

@Controller('gallery')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Get()
  findAll(@Query('serviceId') serviceId?: string) {
    return this.galleryService.findAll(serviceId);
  }

  @Post()
  // @UseGuards(JwtAuthGuard)
  create(@Body() createGalleryImageDto: CreateGalleryImageDto) {
    return this.galleryService.create(createGalleryImageDto);
  }

  @Patch(':id')
  // @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateGalleryImageDto: UpdateGalleryImageDto) {
    return this.galleryService.update(id, updateGalleryImageDto);
  }

  @Delete(':id')
  // @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.galleryService.remove(id);
  }
}
