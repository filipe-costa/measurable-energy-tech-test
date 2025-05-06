import {
  Entity,
  EntityRepositoryType,
  Enum,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/postgresql';
import { IntensityRepository } from '../repository/intensity.repository';

/**
 * Based on the data - the entity should have a compound unique constraint in the datetime fields
 */
@Entity({ repository: () => IntensityRepository })
@Unique({ properties: ['from', 'to'] })
export class Intensity {
  [EntityRepositoryType]?: IntensityRepository;

  @PrimaryKey({ type: 'bigint' })
  id: number;

  @Property({ type: Date })
  from: Date;

  @Property({ type: Date })
  to: Date;

  @Property()
  forecast: number;

  @Property()
  actual: number;

  @Enum(() => IntensityIndex)
  index: IntensityIndex;
}

export enum IntensityIndex {
  LOW = 'low',
  MODERATE = 'moderate',
  HIGH = 'high',
  VERY_HIGH = 'very high',
}
