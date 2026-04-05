import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { OptimizationService } from './optimization.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [
    HttpModule.register({
      timeout: 60_000,
      maxRedirects: 5,
    }),
    PrismaModule,
  ],
  providers: [OptimizationService],
  exports: [OptimizationService],
})
export class OptimizationModule {}
