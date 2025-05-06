import { Migrator } from '@mikro-orm/migrations';
import { defineConfig } from '@mikro-orm/postgresql';
import { SeedManager } from '@mikro-orm/seeder';

export default defineConfig({
  dbName: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT as string),
  debug: true,
  entities: ['dist/database/entities'],
  entitiesTs: ['src/database/entities'],
  migrations: {
    tableName: 'migrations',
    path: 'dist/database/migrations',
    pathTs: 'src/database/migrations',
    transactional: true,
    allOrNothing: true,
    emit: 'ts',
  },
  seeder: {
    path: 'dist/database/seeds',
    pathTs: 'src/database/seeds',
    glob: '!(*.d).{js,ts}',
    emit: 'ts',
  },
  extensions: [Migrator, SeedManager],
});
