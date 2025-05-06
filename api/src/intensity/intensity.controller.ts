import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CarbonIntensityResponseDTO } from './dto/carbon-intensity-response.dto';
import { CreateCarbonIntensityDTO } from './dto/create-carbon-intensity.dto';
import { DeletedCarbonIntensityResponseDTO } from './dto/deleted-carbon-intensity-response.dto';
import { UpdateCarbonIntensityDTO } from './dto/update-carbon-intensity.dto';
import { IntensityService } from './intensity.service';

@ApiTags('intensities')
@Controller('intensities')
export class IntensityController {
  constructor(private readonly intensityService: IntensityService) {}

  @Get()
  @ApiOperation({ summary: 'Get carbon intensities' })
  @ApiOkResponse({ type: [CarbonIntensityResponseDTO] })
  async findAll() {
    const data = await this.intensityService.findAll();
    return CarbonIntensityResponseDTO.toListDTO(data);
  }

  @Post()
  @ApiOperation({ summary: 'Create carbon intensity' })
  @ApiCreatedResponse({ type: CarbonIntensityResponseDTO })
  async create(@Body() dto: CreateCarbonIntensityDTO) {
    const response = await this.intensityService.create(dto);
    return CarbonIntensityResponseDTO.toDTO(response);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update carbon intensity' })
  @ApiOkResponse({ type: CarbonIntensityResponseDTO })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCarbonIntensityDTO,
  ) {
    const response = await this.intensityService.update(id, dto);
    return CarbonIntensityResponseDTO.toDTO(response);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete carbon intensity' })
  @ApiOkResponse({ type: DeletedCarbonIntensityResponseDTO })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.intensityService.remove(id);
    return DeletedCarbonIntensityResponseDTO.toDTO(id);
  }
}
