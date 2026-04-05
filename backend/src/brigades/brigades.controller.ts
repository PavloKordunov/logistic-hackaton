import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { BrigadesService } from './brigades.service';
import { CreateBrigadeDto } from './dto/create-brigade.dto';
import { UpdateBrigadeDto } from './dto/update-brigade.dto';
import { JwtAuthGuard } from 'src/auth/jwtGuard';

@UseGuards(JwtAuthGuard)
@Controller('brigades')
export class BrigadesController {
  constructor(private readonly brigadesService: BrigadesService) {}

  @Post()
  create(@Body() createBrigadeDto: CreateBrigadeDto) {
    return this.brigadesService.create(createBrigadeDto);
  }

  @Get()
  findAll() {
    return this.brigadesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.brigadesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBrigadeDto: UpdateBrigadeDto) {
    return this.brigadesService.update(id, updateBrigadeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.brigadesService.remove(id);
  }
}
