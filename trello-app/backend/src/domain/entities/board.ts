import { BoardId } from '../value-objects/board-id';
import { BoardTitle } from '../value-objects/board-title';
import { BoardDescription } from '../value-objects/board-description';
import { BoardBackgroundColor } from '../value-objects/board-background-color';

export class Board {
  private constructor(
    private readonly _id: BoardId,
    private _title: BoardTitle,
    private _description: BoardDescription,
    private _backgroundColor: BoardBackgroundColor,
    private readonly _createdAt: Date,
    private _updatedAt: Date
  ) {}

  // ファクトリーメソッド: 新規ボード作成
  static create(
    title: string,
    description?: string,
    backgroundColor?: string
  ): Board {
    const now = new Date();
    return new Board(
      BoardId.generate(),
      new BoardTitle(title),
      new BoardDescription(description),
      new BoardBackgroundColor(backgroundColor),
      now,
      now
    );
  }

  // ファクトリーメソッド: 既存データから復元
  static reconstruct(
    id: string,
    title: string,
    description: string,
    backgroundColor: string,
    createdAt: Date,
    updatedAt: Date
  ): Board {
    return new Board(
      new BoardId(id),
      new BoardTitle(title),
      new BoardDescription(description),
      new BoardBackgroundColor(backgroundColor),
      createdAt,
      updatedAt
    );
  }

  // ゲッター
  get id(): BoardId {
    return this._id;
  }

  get title(): BoardTitle {
    return this._title;
  }

  get description(): BoardDescription {
    return this._description;
  }

  get backgroundColor(): BoardBackgroundColor {
    return this._backgroundColor;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // ビジネスロジック: ボード情報更新
  updateInfo(
    title?: string,
    description?: string,
    backgroundColor?: string
  ): void {
    if (title !== undefined) {
      this._title = new BoardTitle(title);
    }
    if (description !== undefined) {
      this._description = new BoardDescription(description);
    }
    if (backgroundColor !== undefined) {
      this._backgroundColor = new BoardBackgroundColor(backgroundColor);
    }
    this._updatedAt = new Date();
  }

  // ビジネスロジック: タイトル変更
  changeTitle(title: string): void {
    this._title = new BoardTitle(title);
    this._updatedAt = new Date();
  }

  // ビジネスロジック: 説明変更
  changeDescription(description: string): void {
    this._description = new BoardDescription(description);
    this._updatedAt = new Date();
  }

  // ビジネスロジック: 背景色変更
  changeBackgroundColor(backgroundColor: string): void {
    this._backgroundColor = new BoardBackgroundColor(backgroundColor);
    this._updatedAt = new Date();
  }

  // エンティティの等価性判定
  equals(other: Board): boolean {
    return this._id.equals(other._id);
  }

  // プリミティブ型への変換（インフラ層で使用）
  toPrimitives(): {
    id: string;
    title: string;
    description: string;
    backgroundColor: string;
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      id: this._id.value,
      title: this._title.value,
      description: this._description.value,
      backgroundColor: this._backgroundColor.value,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt
    };
  }
}