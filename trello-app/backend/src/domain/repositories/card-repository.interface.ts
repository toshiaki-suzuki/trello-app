import { Card } from '../entities/card';
import { CardId } from '../value-objects/card-id';
import { ListId } from '../value-objects/list-id';

export interface CardRepository {
  // カード保存
  save(card: Card): Promise<void>;

  // ID指定でカード取得
  findById(id: CardId): Promise<Card | null>;

  // リスト指定でカード一覧取得
  findByListId(listId: ListId): Promise<Card[]>;

  // 全カード取得
  findAll(): Promise<Card[]>;

  // カード削除
  delete(id: CardId): Promise<void>;

  // カード存在確認
  exists(id: CardId): Promise<boolean>;

  // リスト内のカード数取得
  countByListId(listId: ListId): Promise<number>;

  // 期限切れのカード取得
  findOverdueCards(): Promise<Card[]>;

  // 期限が近いカード取得（指定日数以内）
  findUpcomingCards(days: number): Promise<Card[]>;
}