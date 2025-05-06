import { EntityManager } from '@mikro-orm/postgresql';
import { Seeder } from '@mikro-orm/seeder';
import * as csv from 'csv-parser';
import * as fs from 'fs';
import * as path from 'path';
import { Intensity, IntensityIndex } from '../entities/intensity.entity';

type CSVEnergyData = {
  from: string;
  to: string;
  intensity_forecast: number;
  intensity_actual: number;
  index: 'low' | 'moderate' | 'high' | 'very high';
};

export class InitialCarbonIntensityDataSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const csvFile = path.join(__dirname, '/csv/carbon-intensity-data.csv');
    const parser = fs.createReadStream(csvFile).pipe(csv());

    for await (const record of parser) {
      em.create(
        Intensity,
        this.convertCSVDataToIntensityEntityData(record as CSVEnergyData),
      );
    }

    await em.flush();
  }

  private convertCSVDataToIntensityEntityData({
    intensity_actual,
    intensity_forecast,
    from,
    to,
    index,
  }: CSVEnergyData): Intensity {
    const intensity = new Intensity();
    intensity.actual = intensity_actual;
    intensity.forecast = intensity_forecast;
    intensity.from = new Date(from);
    intensity.to = new Date(to);
    intensity.index = index as IntensityIndex;
    return intensity;
  }
}
