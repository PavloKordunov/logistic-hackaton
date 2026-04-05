import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RouteService } from './route.service';
import { AutoPlanDto } from './dto/auto-plan.dto';

import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwtGuard';

@UseGuards(JwtAuthGuard)
@Controller('routes')
export class RouteController {
  constructor(private readonly routeService: RouteService) {}

  @Post('auto-plan')
  autoPlan(@Body() dto: AutoPlanDto) {
    return this.routeService.autoPlan(dto);
  }

  @Get('driver/:vehicleId')
  getDriverRoute(@Param('vehicleId') vehicleId: string) {
    return this.routeService.getDriverRoute(vehicleId);
  }

  @Get(':routeId/geometry')
  getRouteGeometry(@Param('routeId') routeId: string) {
    return this.routeService.getRouteGeometry(routeId);
  }
}
