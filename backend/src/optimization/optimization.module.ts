import { Module } from '@nestjs/common';
import { OptimizationService } from './optimization.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports:[PrismaModule],
  providers: [OptimizationService],
  exports:[OptimizationService]
})
export class OptimizationModule {}
