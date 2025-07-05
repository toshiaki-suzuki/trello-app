import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { List } from '../../domain/entities/list';
import { ListId } from '../../domain/value-objects/list-id';
import { BoardId } from '../../domain/value-objects/board-id';
import { ListRepository } from '../../domain/repositories/list-repository.interface';
import { ListEntity } from '../entities/list.entity';

@Injectable()
export class TypeOrmListRepository implements ListRepository {
  constructor(
    @InjectRepository(ListEntity)
    private readonly listRepository: Repository<ListEntity>
  ) {}

  async save(list: List): Promise<void> {
    const primitives = list.toPrimitives();
    const entity = this.listRepository.create(primitives);
    await this.listRepository.save(entity);
  }

  async findById(id: ListId): Promise<List | null> {
    const entity = await this.listRepository.findOne({
      where: { id: id.value }
    });

    if (!entity) {
      return null;
    }

    return List.reconstruct(
      entity.id,
      entity.boardId,
      entity.title,
      entity.position,
      entity.createdAt,
      entity.updatedAt
    );
  }

  async findByBoardId(boardId: BoardId): Promise<List[]> {
    const entities = await this.listRepository.find({
      where: { boardId: boardId.value },
      order: { position: 'ASC' }
    });

    return entities.map(entity =>
      List.reconstruct(
        entity.id,
        entity.boardId,
        entity.title,
        entity.position,
        entity.createdAt,
        entity.updatedAt
      )
    );
  }

  async findAll(): Promise<List[]> {
    const entities = await this.listRepository.find({
      order: { position: 'ASC' }
    });

    return entities.map(entity =>
      List.reconstruct(
        entity.id,
        entity.boardId,
        entity.title,
        entity.position,
        entity.createdAt,
        entity.updatedAt
      )
    );
  }

  async delete(id: ListId): Promise<void> {
    await this.listRepository.delete({ id: id.value });
  }

  async exists(id: ListId): Promise<boolean> {
    const count = await this.listRepository.count({
      where: { id: id.value }
    });
    return count > 0;
  }

  async countByBoardId(boardId: BoardId): Promise<number> {
    return await this.listRepository.count({
      where: { boardId: boardId.value }
    });
  }
}