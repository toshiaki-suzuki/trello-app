import { List } from '../entities/list';
import { ListId } from '../value-objects/list-id';
import { BoardId } from '../value-objects/board-id';

export interface ListRepository {
  // リスト保存
  save(list: List): Promise<void>;

  // ID指定でリスト取得
  findById(id: ListId): Promise<List | null>;

  // ボード指定でリスト一覧取得
  findByBoardId(boardId: BoardId): Promise<List[]>;

  // 全リスト取得
  findAll(): Promise<List[]>;

  // リスト削除
  delete(id: ListId): Promise<void>;

  // リスト存在確認
  exists(id: ListId): Promise<boolean>;

  // ボード内のリスト数取得
  countByBoardId(boardId: BoardId): Promise<number>;
}