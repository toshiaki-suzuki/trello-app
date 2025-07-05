import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, Between } from 'typeorm';
import { Card } from '../../domain/entities/card';
import { CardId } from '../../domain/value-objects/card-id';
import { ListId } from '../../domain/value-objects/list-id';
import { CardRepository } from '../../domain/repositories/card-repository.interface';
import { CardEntity } from '../entities/card.entity';

@Injectable()
export class TypeOrmCardRepository implements CardRepository {
  constructor(
    @InjectRepository(CardEntity)
    private readonly cardRepository: Repository<CardEntity>
  ) {}

  async save(card: Card): Promise<void> {
    const primitives = card.toPrimitives();
    const entity = this.cardRepository.create(primitives);
    await this.cardRepository.save(entity);
  }

  async findById(id: CardId): Promise<Card | null> {
    const entity = await this.cardRepository.findOne({
      where: { id: id.value }
    });

    if (!entity) {
      return null;
    }

    return Card.reconstruct(
      entity.id,
      entity.listId,
      entity.title,
      entity.description,
      entity.position,
      entity.dueDate,
      entity.createdAt,
      entity.updatedAt
    );
  }

  async findByListId(listId: ListId): Promise<Card[]> {
    const entities = await this.cardRepository.find({
      where: { listId: listId.value },
      order: { position: 'ASC' }
    });

    return entities.map(entity =>
      Card.reconstruct(
        entity.id,
        entity.listId,
        entity.title,
        entity.description,
        entity.position,
        entity.dueDate,
        entity.createdAt,
        entity.updatedAt
      )
    );
  }

  async findAll(): Promise<Card[]> {
    const entities = await this.cardRepository.find({
      order: { position: 'ASC' }
    });

    return entities.map(entity =>
      Card.reconstruct(
        entity.id,
        entity.listId,
        entity.title,
        entity.description,
        entity.position,
        entity.dueDate,
        entity.createdAt,
        entity.updatedAt
      )
    );
  }

  async delete(id: CardId): Promise<void> {
    await this.cardRepository.delete({ id: id.value });
  }

  async exists(id: CardId): Promise<boolean> {
    const count = await this.cardRepository.count({
      where: { id: id.value }
    });
    return count > 0;
  }

  async countByListId(listId: ListId): Promise<number> {
    return await this.cardRepository.count({
      where: { listId: listId.value }
    });
  }

  async findOverdueCards(): Promise<Card[]> {
    const now = new Date();
    const entities = await this.cardRepository.find({
      where: { dueDate: LessThan(now) },
      order: { dueDate: 'ASC' }
    });

    return entities.map(entity =>
      Card.reconstruct(
        entity.id,
        entity.listId,
        entity.title,
        entity.description,
        entity.position,
        entity.dueDate,
        entity.createdAt,
        entity.updatedAt
      )
    );
  }

  async findUpcomingCards(days: number): Promise<Card[]> {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(now.getDate() + days);

    const entities = await this.cardRepository.find({
      where: { dueDate: Between(now, futureDate) },
      order: { dueDate: 'ASC' }
    });

    return entities.map(entity =>
      Card.reconstruct(
        entity.id,
        entity.listId,
        entity.title,
        entity.description,
        entity.position,
        entity.dueDate,
        entity.createdAt,
        entity.updatedAt
      )
    );
  }
}