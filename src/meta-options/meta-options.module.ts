import { Module } from '@nestjs/common';

import { MetaOption } from './meta-option.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MetaOptionsService } from './providers/meta-options.service';
import { MetaOptionsController } from './meta-options.controller';

@Module({
  controllers: [MetaOptionsController],
  imports: [TypeOrmModule.forFeature([MetaOption])],
  providers: [MetaOptionsService],
})
export class MetaOptionsModule {}
