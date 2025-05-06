import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MikroORM } from '@mikro-orm/postgresql';
import { Module, OnModuleInit } from '@nestjs/common';
import { IntensityModule } from './intensity/intensity.module';

@Module({
  imports: [MikroOrmModule.forRoot(), IntensityModule],
  controllers: [],
  providers: [],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly orm: MikroORM) {}
  async onModuleInit(): Promise<void> {
    const migrator = this.orm.getMigrator();
    await migrator.up();
  }
}
