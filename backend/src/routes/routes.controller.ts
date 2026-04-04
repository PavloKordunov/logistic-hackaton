import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { AssignRouteDto } from './dto/assign-route.dto';

@Controller('routes')
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  @Post('assign')
  create(@Body() dto: AssignRouteDto) {
    return this.routesService.createRoute(dto);
  }

  @Get('driver/:vehicleId')
  getDriverRoute(@Param('vehicleId') vehicleId:string){
    return this.routesService.getDriverRoute(vehicleId)
  }
}
