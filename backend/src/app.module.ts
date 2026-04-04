import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BrigadesModule } from './brigades/brigades.module';
import { ResourcesModule } from './resources/resources.module';
import { RoutesModule } from './routes/routes.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import {ConfigModule} from '@nestjs/config';
import { VehiclesModule } from './vehicles/vehicles.module';
import { DeliveriesModule } from './deliveries/deliveries.module';
import { AlertModule } from './alert/alert.module';
import { OptimizationModule } from './optimization/optimization.module';

@Module({
  imports: [BrigadesModule, ResourcesModule, RoutesModule, PrismaModule, AuthModule,ConfigModule.forRoot({
    isGlobal:true
  }), VehiclesModule, DeliveriesModule, AlertModule, OptimizationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
