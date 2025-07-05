import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardController } from './presentation/controllers/board.controller';
import { BoardService } from './application/services/board.service';
import { TypeOrmBoardRepository } from './infrastructure/repositories/board.repository';
import { BoardEntity } from './infrastructure/entities/board.entity';
import { BoardRepository } from './domain/repositories/board-repository.interface';

@Module({
  imports: [TypeOrmModule.forFeature([BoardEntity])],
  controllers: [BoardController],
  providers: [
    BoardService,
    {
      provide: BoardRepository,
      useClass: TypeOrmBoardRepository,
    },
  ],
  exports: [BoardService],
})
export class BoardModule {}