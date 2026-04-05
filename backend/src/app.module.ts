import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BrigadesModule } from './brigades/brigades.module';
import { ResourcesModule } from './resources/resources.module';
import { RouteModule } from './route/route.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { VehiclesModule } from './vehicles/vehicles.module';
import { DeliveriesModule } from './deliveries/deliveries.module';
import { AlertModule } from './alert/alert.module';
import { WarehousesModule } from './warehouses/warehouses.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    BrigadesModule,
    ResourcesModule,
    RouteModule,
    PrismaModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    VehiclesModule,
    DeliveriesModule,
    AlertModule,
    WarehousesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
