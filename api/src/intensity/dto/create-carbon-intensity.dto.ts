import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
} from 'class-validator';
import { IntensityIndex } from '../../database/entities/intensity.entity';

export class CreateCarbonIntensityDTO {
  @ApiProperty({ type: Date })
  @Expose()
  @IsDateString()
  @IsNotEmpty()
  readonly from: string;

  @ApiProperty({ type: Date })
  @Expose()
  @IsDateString()
  @IsNotEmpty()
  readonly to: string;

  @ApiProperty()
  @Expose()
  @IsPositive()
  @IsNumber({ maxDecimalPlaces: 0 })
  @Type(() => Number)
  readonly forecast: number;

  @ApiProperty()
  @Expose()
  @IsPositive()
  @IsNumber({ maxDecimalPlaces: 0 })
  @Type(() => Number)
  readonly actual: number;

  @ApiProperty({ enum: IntensityIndex })
  @Expose()
  @IsEnum(IntensityIndex)
  readonly index: IntensityIndex;
}
