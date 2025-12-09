import { Module } from '@nestjs/common';
import * as drizzleProvider from './drizzle.provider';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [...drizzleProvider.drizzleProvider],
  exports: [drizzleProvider.DrizzleAsyncProvider],
})
export class DrizzleModule {}
