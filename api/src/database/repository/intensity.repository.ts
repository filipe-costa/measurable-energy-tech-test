import { EntityRepository } from '@mikro-orm/postgresql';
import { Intensity } from '../entities/intensity.entity';

export class IntensityRepository extends EntityRepository<Intensity> {}
