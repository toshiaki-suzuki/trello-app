import { Board } from '../entities/board';
import { BoardId } from '../value-objects/board-id';

export interface BoardRepository {
  // ボード保存
  save(board: Board): Promise<void>;

  // ID指定でボード取得
  findById(id: BoardId): Promise<Board | null>;

  // 全ボード取得
  findAll(): Promise<Board[]>;

  // ボード削除
  delete(id: BoardId): Promise<void>;

  // ボード存在確認
  exists(id: BoardId): Promise<boolean>;
}