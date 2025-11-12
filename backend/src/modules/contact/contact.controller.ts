import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  create(@Body() createContactDto: CreateContactDto) {
    return this.contactService.create(createContactDto);
  }

  @Get()
  // @UseGuards(JwtAuthGuard) - Add auth later
  findAll() {
    return this.contactService.findAll();
  }

  @Get(':id')
  // @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.contactService.findOne(id);
  }

  @Patch(':id/status')
  // @UseGuards(JwtAuthGuard)
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.contactService.updateStatus(id, status);
  }

  @Delete(':id')
  // @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.contactService.remove(id);
  }
}
