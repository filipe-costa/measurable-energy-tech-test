import {
  EntityManager,
  QueryOrder,
  UniqueConstraintViolationException,
} from '@mikro-orm/postgresql';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IntensityRepository } from '../database/repository/intensity.repository';
import { CreateCarbonIntensityDTO } from './dto/create-carbon-intensity.dto';
import { UpdateCarbonIntensityDTO } from './dto/update-carbon-intensity.dto';

@Injectable()
export class IntensityService {
  constructor(
    private readonly intensityRepository: IntensityRepository,
    private readonly em: EntityManager,
  ) {}

  async findAll() {
    return await this.intensityRepository.findAll({
      orderBy: { from: QueryOrder.ASC },
    });
  }

  async create(dto: CreateCarbonIntensityDTO) {
    try {
      const entity = this.intensityRepository.create(dto);
      await this.em.flush();
      return entity;
    } catch (error) {
      if (error instanceof UniqueConstraintViolationException) {
        throw new BadRequestException('to and from should be unique');
      }
      throw error;
    }
  }

  async update(id: number, dto: UpdateCarbonIntensityDTO) {
    try {
      const entity = await this.intensityRepository.findOneOrFail(
        { id },
        {
          failHandler: () =>
            new NotFoundException('carbon intensity does not exist'),
        },
      );

      this.intensityRepository.assign(entity, dto);

      await this.em.flush();

      return entity;
    } catch (error) {
      if (error instanceof UniqueConstraintViolationException) {
        throw new BadRequestException('to and from should be unique');
      }
      throw error;
    }
  }

  async remove(id: number) {
    await this.intensityRepository.findOneOrFail(
      { id },
      { failHandler: () => new NotFoundException() },
    );

    await this.intensityRepository.nativeDelete({ id });

    return id;
  }
}
