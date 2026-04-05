import { Module } from '@nestjs/common';
import { AlertService } from './alert.service';
import { AlertController } from './alert.controller';
import { OptimizationModule } from 'src/optimization/optimization.module';

@Module({
  imports: [OptimizationModule],
  controllers: [AlertController],
  providers: [AlertService],
})
export class AlertModule {}
