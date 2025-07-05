import { ListId } from '../value-objects/list-id';
import { ListTitle } from '../value-objects/list-title';
import { ListPosition } from '../value-objects/list-position';
import { BoardId } from '../value-objects/board-id';

export class List {
  private constructor(
    private readonly _id: ListId,
    private readonly _boardId: BoardId,
    private _title: ListTitle,
    private _position: ListPosition,
    private readonly _createdAt: Date,
    private _updatedAt: Date
  ) {}

  // ファクトリーメソッド: 新規リスト作成
  static create(
    boardId: string,
    title: string,
    position: number = 0
  ): List {
    const now = new Date();
    return new List(
      ListId.generate(),
      new BoardId(boardId),
      new ListTitle(title),
      new ListPosition(position),
      now,
      now
    );
  }

  // ファクトリーメソッド: 既存データから復元
  static reconstruct(
    id: string,
    boardId: string,
    title: string,
    position: number,
    createdAt: Date,
    updatedAt: Date
  ): List {
    return new List(
      new ListId(id),
      new BoardId(boardId),
      new ListTitle(title),
      new ListPosition(position),
      createdAt,
      updatedAt
    );
  }

  // ゲッター
  get id(): ListId {
    return this._id;
  }

  get boardId(): BoardId {
    return this._boardId;
  }

  get title(): ListTitle {
    return this._title;
  }

  get position(): ListPosition {
    return this._position;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // ビジネスロジック: タイトル変更
  changeTitle(title: string): void {
    this._title = new ListTitle(title);
    this._updatedAt = new Date();
  }

  // ビジネスロジック: ポジション変更
  changePosition(position: number): void {
    this._position = new ListPosition(position);
    this._updatedAt = new Date();
  }

  // ビジネスロジック: リスト情報更新
  updateInfo(title?: string, position?: number): void {
    if (title !== undefined) {
      this._title = new ListTitle(title);
    }
    if (position !== undefined) {
      this._position = new ListPosition(position);
    }
    this._updatedAt = new Date();
  }

  // エンティティの等価性判定
  equals(other: List): boolean {
    return this._id.equals(other._id);
  }

  // プリミティブ型への変換（インフラ層で使用）
  toPrimitives(): {
    id: string;
    boardId: string;
    title: string;
    position: number;
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      id: this._id.value,
      boardId: this._boardId.value,
      title: this._title.value,
      position: this._position.value,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt
    };
  }
}