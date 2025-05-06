import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MikroORM } from '@mikro-orm/postgresql';
import { Test, TestingModule } from '@nestjs/testing';
import {
  Intensity,
  IntensityIndex,
} from '../database/entities/intensity.entity';
import config from '../database/mikro-orm.config';
import { CarbonIntensityResponseDTO } from './dto/carbon-intensity-response.dto';
import { DeletedCarbonIntensityResponseDTO } from './dto/deleted-carbon-intensity-response.dto';
import { IntensityController } from './intensity.controller';
import { IntensityService } from './intensity.service';

describe('Intensity Integration', () => {
  let intensityController: IntensityController;
  let intensityService: IntensityService;
  let orm: MikroORM;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MikroOrmModule.forRoot({
          ...config,
          dbName: 'test',
          password: 'test',
          user: 'test',
          host: 'localhost',
          port: 5432,
          connect: false,
          logger: () => {},
        }),
        MikroOrmModule.forFeature({ entities: [Intensity] }),
      ],
      controllers: [IntensityController],
      providers: [IntensityService],
    }).compile();

    intensityService = moduleFixture.get<IntensityService>(IntensityService);
    intensityController =
      moduleFixture.get<IntensityController>(IntensityController);
    orm = moduleFixture.get<MikroORM>(MikroORM);
  });

  afterEach(async () => {
    await orm.close(true);
  });

  describe('findAll()', () => {
    it('should return an array of intensities', async () => {
      const intensities = [
        createIntensityEntity(1, 200, 300, IntensityIndex.HIGH),
        createIntensityEntity(2, 100, 150, IntensityIndex.LOW),
      ];

      const spy = jest.spyOn(intensityService, 'findAll');
      spy.mockResolvedValue(intensities);

      const result = await intensityController.findAll();

      expect(spy).toHaveBeenCalled();
      expect(result).toMatchObject(intensities);
    });
  });

  describe('create()', () => {
    it('should return created intensity when successful', async () => {
      const intensity = createIntensityEntity(1, 200, 300, IntensityIndex.HIGH);
      const dto = createIntensityDTO({
        actual: intensity.actual,
        forecast: intensity.forecast,
        index: intensity.index,
      });

      const spy = jest.spyOn(intensityService, 'create');
      spy.mockResolvedValue(intensity);

      const result = await intensityController.create(dto);

      expect(spy).toHaveBeenCalledWith(dto);
      expect(result).toMatchObject(CarbonIntensityResponseDTO.toDTO(intensity));
    });
  });

  describe('update()', () => {
    it('should return updated intensity when successful', async () => {
      const intensity = createIntensityEntity(1, 200, 300, IntensityIndex.HIGH);

      const updatedIntensity = createIntensityEntity(
        1,
        100,
        100,
        IntensityIndex.LOW,
      );

      const dto = createIntensityDTO({
        actual: 100,
        forecast: 100,
        index: updatedIntensity.index,
      });

      const spy = jest.spyOn(intensityService, 'update');
      spy.mockResolvedValue(updatedIntensity);

      const result = await intensityController.update(intensity.id, dto);

      expect(spy).toHaveBeenCalledWith(intensity.id, dto);
      expect(result).toMatchObject(
        CarbonIntensityResponseDTO.toDTO(updatedIntensity),
      );
    });
  });

  describe('delete()', () => {
    it('should return updated intensity when successful', async () => {
      const intensityId = 1;

      const spy = jest.spyOn(intensityService, 'remove');
      spy.mockResolvedValue(intensityId);

      const result = await intensityController.remove(intensityId);

      expect(spy).toHaveBeenCalledWith(intensityId);
      expect(result).toMatchObject(
        DeletedCarbonIntensityResponseDTO.toDTO(intensityId),
      );
    });
  });

  function createIntensityDTO({
    id,
    actual,
    forecast,
    index,
  }: {
    id?: number;
    actual: number;
    forecast: number;
    index: IntensityIndex;
  }) {
    return {
      ...(id && { id }),
      from: '2020-01-22T17:00:00.000Z',
      to: '2020-01-22T17:30:00.000Z',
      actual,
      forecast,
      index,
    };
  }

  function createIntensityEntity(
    id: number,
    actual: number,
    forecast: number,
    index: IntensityIndex,
  ) {
    const intensity = new Intensity();
    intensity.id = id;
    intensity.from = new Date('2020-01-22T17:00:00.000Z');
    intensity.to = new Date('2020-01-22T17:30:00.000Z');
    intensity.actual = actual;
    intensity.forecast = forecast;
    intensity.index = index;
    return intensity;
  }
});
