import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListController } from './presentation/controllers/list.controller';
import { ListService } from './application/services/list.service';
import { TypeOrmListRepository } from './infrastructure/repositories/list.repository';
import { ListEntity } from './infrastructure/entities/list.entity';
import { ListRepository } from './domain/repositories/list-repository.interface';
import { BoardModule } from './board.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ListEntity]),
    BoardModule
  ],
  controllers: [ListController],
  providers: [
    ListService,
    {
      provide: ListRepository,
      useClass: TypeOrmListRepository,
    },
  ],
  exports: [ListService],
})
export class ListModule {}