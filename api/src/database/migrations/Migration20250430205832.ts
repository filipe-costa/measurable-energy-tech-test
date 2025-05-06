import { Migration } from '@mikro-orm/migrations';

export class Migration20250430205832 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "intensity" ("id" bigserial primary key, "from" timestamptz not null, "to" timestamptz not null, "forecast" int not null, "actual" int not null, "index" text check ("index" in ('low', 'moderate', 'high', 'very high')) not null);`,
    );
    this.addSql(
      `alter table "intensity" add constraint "intensity_from_to_unique" unique ("from", "to");`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "intensity" cascade;`);
  }
}
