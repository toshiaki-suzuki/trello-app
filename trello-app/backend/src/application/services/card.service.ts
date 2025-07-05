import { Injectable } from '@nestjs/common';
import { Card } from '../../domain/entities/card';
import { CardId } from '../../domain/value-objects/card-id';
import { ListId } from '../../domain/value-objects/list-id';
import { CardRepository } from '../../domain/repositories/card-repository.interface';
import { ListRepository } from '../../domain/repositories/list-repository.interface';
import { CreateCardDto, UpdateCardDto, MoveCardDto, CardDto } from '../dto/card.dto';

@Injectable()
export class CardService {
  constructor(
    private readonly cardRepository: CardRepository,
    private readonly listRepository: ListRepository
  ) {}

  // カード作成
  async createCard(dto: CreateCardDto): Promise<CardDto> {
    // リスト存在確認
    const listId = new ListId(dto.listId);
    const listExists = await this.listRepository.exists(listId);
    
    if (!listExists) {
      throw new Error(`リスト（ID: ${dto.listId}）が見つかりません`);
    }

    // ポジション設定（未指定の場合は末尾に追加）
    let position = dto.position;
    if (position === undefined) {
      const cardCount = await this.cardRepository.countByListId(listId);
      position = cardCount;
    }

    // 期限の変換
    const dueDate = dto.dueDate ? new Date(dto.dueDate) : undefined;

    const card = Card.create(
      dto.listId,
      dto.title,
      dto.description,
      position,
      dueDate
    );

    await this.cardRepository.save(card);

    return this.toDto(card);
  }

  // カード取得
  async getCardById(id: string): Promise<CardDto> {
    const cardId = new CardId(id);
    const card = await this.cardRepository.findById(cardId);

    if (!card) {
      throw new Error(`カード（ID: ${id}）が見つかりません`);
    }

    return this.toDto(card);
  }

  // リスト指定でカード一覧取得
  async getCardsByListId(listId: string): Promise<CardDto[]> {
    const listIdObj = new ListId(listId);
    const cards = await this.cardRepository.findByListId(listIdObj);
    
    // ポジション順にソート
    cards.sort((a, b) => a.position.value - b.position.value);
    
    return cards.map(card => this.toDto(card));
  }

  // 全カード取得
  async getAllCards(): Promise<CardDto[]> {
    const cards = await this.cardRepository.findAll();
    return cards.map(card => this.toDto(card));
  }

  // カード更新
  async updateCard(id: string, dto: UpdateCardDto): Promise<CardDto> {
    const cardId = new CardId(id);
    const card = await this.cardRepository.findById(cardId);

    if (!card) {
      throw new Error(`カード（ID: ${id}）が見つかりません`);
    }

    // 期限の変換
    const dueDate = dto.dueDate ? new Date(dto.dueDate) : undefined;

    card.updateInfo(dto.title, dto.description, dto.position, dueDate);
    await this.cardRepository.save(card);

    return this.toDto(card);
  }

  // カード移動
  async moveCard(id: string, dto: MoveCardDto): Promise<CardDto> {
    const cardId = new CardId(id);
    const card = await this.cardRepository.findById(cardId);

    if (!card) {
      throw new Error(`カード（ID: ${id}）が見つかりません`);
    }

    // 移動先リスト存在確認
    const listId = new ListId(dto.listId);
    const listExists = await this.listRepository.exists(listId);
    
    if (!listExists) {
      throw new Error(`リスト（ID: ${dto.listId}）が見つかりません`);
    }

    // 現在のリストと異なる場合は新しいカードを作成
    const primitives = card.toPrimitives();
    if (primitives.listId !== dto.listId) {
      // 古いカードを削除
      await this.cardRepository.delete(cardId);
      
      // 新しいカードを作成
      const newCard = Card.create(
        dto.listId,
        primitives.title,
        primitives.description,
        dto.position,
        primitives.dueDate
      );
      
      await this.cardRepository.save(newCard);
      return this.toDto(newCard);
    } else {
      // 同じリスト内での移動
      card.changePosition(dto.position);
      await this.cardRepository.save(card);
      return this.toDto(card);
    }
  }

  // カード削除
  async deleteCard(id: string): Promise<void> {
    const cardId = new CardId(id);
    const exists = await this.cardRepository.exists(cardId);

    if (!exists) {
      throw new Error(`カード（ID: ${id}）が見つかりません`);
    }

    await this.cardRepository.delete(cardId);
  }

  // 期限切れのカード取得
  async getOverdueCards(): Promise<CardDto[]> {
    const cards = await this.cardRepository.findOverdueCards();
    return cards.map(card => this.toDto(card));
  }

  // 期限が近いカード取得
  async getUpcomingCards(days: number = 7): Promise<CardDto[]> {
    const cards = await this.cardRepository.findUpcomingCards(days);
    return cards.map(card => this.toDto(card));
  }

  // カード存在確認
  async cardExists(id: string): Promise<boolean> {
    const cardId = new CardId(id);
    return await this.cardRepository.exists(cardId);
  }

  // ドメインエンティティをDTOに変換
  private toDto(card: Card): CardDto {
    const primitives = card.toPrimitives();
    return new CardDto(
      primitives.id,
      primitives.listId,
      primitives.title,
      primitives.description,
      primitives.position,
      primitives.dueDate,
      primitives.createdAt,
      primitives.updatedAt
    );
  }
}