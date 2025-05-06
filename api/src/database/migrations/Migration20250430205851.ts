import { Migration } from '@mikro-orm/migrations';
import { InitialCarbonIntensityDataSeeder } from '../seeds/initial-carbon-intensity-data.seeder';

export class Migration20250430205851 extends Migration {
  override async up(): Promise<void> {
    const seeder = new InitialCarbonIntensityDataSeeder();

    await seeder.run(this.getEntityManager());
  }

  override down(): void {
    this.addSql(`truncate table if exists "intensity" cascade;`);
  }
}
