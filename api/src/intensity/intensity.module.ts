import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Intensity } from '../database/entities/intensity.entity';
import { IntensityController } from './intensity.controller';
import { IntensityService } from './intensity.service';

@Module({
  controllers: [IntensityController],
  imports: [MikroOrmModule.forFeature({ entities: [Intensity] })],
  providers: [IntensityService],
})
export class IntensityModule {}
