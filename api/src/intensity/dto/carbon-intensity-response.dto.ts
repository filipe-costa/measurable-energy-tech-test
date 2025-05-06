import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  Intensity,
  IntensityIndex,
} from '../../database/entities/intensity.entity';

export class CarbonIntensityResponseDTO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty({ type: Date })
  @Expose()
  @Type(() => Date)
  from: Date;

  @ApiProperty({ type: Date })
  @Expose()
  @Type(() => Date)
  to: Date;

  @ApiProperty()
  @Expose()
  actual: number;

  @ApiProperty()
  @Expose()
  forecast: number;

  @ApiProperty({ enum: IntensityIndex })
  @Expose()
  index: IntensityIndex;

  static toDTO(entity: Intensity) {
    const dto = new CarbonIntensityResponseDTO();
    dto.from = entity.from;
    dto.to = entity.to;
    dto.id = entity.id;
    dto.actual = entity.actual;
    dto.forecast = entity.forecast;
    dto.index = entity.index;
    return dto;
  }

  static toListDTO(entities: Intensity[]) {
    return entities.map((e) => this.toDTO(e));
  }
}
