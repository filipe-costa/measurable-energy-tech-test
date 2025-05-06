import { PickType } from '@nestjs/swagger';
import { CarbonIntensityResponseDTO } from './carbon-intensity-response.dto';

export class DeletedCarbonIntensityResponseDTO extends PickType(
  CarbonIntensityResponseDTO,
  ['id'],
) {
  static toDTO(id: number) {
    const dto = new DeletedCarbonIntensityResponseDTO();
    dto.id = id;
    return dto;
  }
}
