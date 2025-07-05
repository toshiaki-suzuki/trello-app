import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from '../../domain/entities/board';
import { BoardId } from '../../domain/value-objects/board-id';
import { BoardRepository } from '../../domain/repositories/board-repository.interface';
import { BoardEntity } from '../entities/board.entity';

@Injectable()
export class TypeOrmBoardRepository implements BoardRepository {
  constructor(
    @InjectRepository(BoardEntity)
    private readonly boardRepository: Repository<BoardEntity>
  ) {}

  async save(board: Board): Promise<void> {
    const primitives = board.toPrimitives();
    const entity = this.boardRepository.create(primitives);
    await this.boardRepository.save(entity);
  }

  async findById(id: BoardId): Promise<Board | null> {
    const entity = await this.boardRepository.findOne({
      where: { id: id.value }
    });

    if (!entity) {
      return null;
    }

    return Board.reconstruct(
      entity.id,
      entity.title,
      entity.description,
      entity.backgroundColor,
      entity.createdAt,
      entity.updatedAt
    );
  }

  async findAll(): Promise<Board[]> {
    const entities = await this.boardRepository.find();
    
    return entities.map(entity =>
      Board.reconstruct(
        entity.id,
        entity.title,
        entity.description,
        entity.backgroundColor,
        entity.createdAt,
        entity.updatedAt
      )
    );
  }

  async delete(id: BoardId): Promise<void> {
    await this.boardRepository.delete({ id: id.value });
  }

  async exists(id: BoardId): Promise<boolean> {
    const count = await this.boardRepository.count({
      where: { id: id.value }
    });
    return count > 0;
  }
}