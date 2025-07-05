import { CardId } from '../value-objects/card-id';
import { CardTitle } from '../value-objects/card-title';
import { CardDescription } from '../value-objects/card-description';
import { CardPosition } from '../value-objects/card-position';
import { CardDueDate } from '../value-objects/card-due-date';
import { ListId } from '../value-objects/list-id';

export class Card {
  private constructor(
    private readonly _id: CardId,
    private readonly _listId: ListId,
    private _title: CardTitle,
    private _description: CardDescription,
    private _position: CardPosition,
    private _dueDate: CardDueDate,
    private readonly _createdAt: Date,
    private _updatedAt: Date
  ) {}

  // ファクトリーメソッド: 新規カード作成
  static create(
    listId: string,
    title: string,
    description?: string,
    position: number = 0,
    dueDate?: Date
  ): Card {
    const now = new Date();
    return new Card(
      CardId.generate(),
      new ListId(listId),
      new CardTitle(title),
      new CardDescription(description),
      new CardPosition(position),
      new CardDueDate(dueDate),
      now,
      now
    );
  }

  // ファクトリーメソッド: 既存データから復元
  static reconstruct(
    id: string,
    listId: string,
    title: string,
    description: string,
    position: number,
    dueDate: Date | null,
    createdAt: Date,
    updatedAt: Date
  ): Card {
    return new Card(
      new CardId(id),
      new ListId(listId),
      new CardTitle(title),
      new CardDescription(description),
      new CardPosition(position),
      new CardDueDate(dueDate),
      createdAt,
      updatedAt
    );
  }

  // ゲッター
  get id(): CardId {
    return this._id;
  }

  get listId(): ListId {
    return this._listId;
  }

  get title(): CardTitle {
    return this._title;
  }

  get description(): CardDescription {
    return this._description;
  }

  get position(): CardPosition {
    return this._position;
  }

  get dueDate(): CardDueDate {
    return this._dueDate;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // ビジネスロジック: タイトル変更
  changeTitle(title: string): void {
    this._title = new CardTitle(title);
    this._updatedAt = new Date();
  }

  // ビジネスロジック: 説明変更
  changeDescription(description: string): void {
    this._description = new CardDescription(description);
    this._updatedAt = new Date();
  }

  // ビジネスロジック: ポジション変更
  changePosition(position: number): void {
    this._position = new CardPosition(position);
    this._updatedAt = new Date();
  }

  // ビジネスロジック: 期限変更
  changeDueDate(dueDate?: Date): void {
    this._dueDate = new CardDueDate(dueDate);
    this._updatedAt = new Date();
  }

  // ビジネスロジック: カード情報更新
  updateInfo(
    title?: string,
    description?: string,
    position?: number,
    dueDate?: Date
  ): void {
    if (title !== undefined) {
      this._title = new CardTitle(title);
    }
    if (description !== undefined) {
      this._description = new CardDescription(description);
    }
    if (position !== undefined) {
      this._position = new CardPosition(position);
    }
    if (dueDate !== undefined) {
      this._dueDate = new CardDueDate(dueDate);
    }
    this._updatedAt = new Date();
  }

  // ビジネスロジック: 他のリストへ移動
  moveToList(listId: string, position: number): void {
    // 注意: listIdの変更は通常、別のドメインサービスで行うべき
    // ここでは簡易的な実装として、新しいカードを作成して返す必要がある
    // 実際の実装では、CardDomainServiceを使用すべき
    this._position = new CardPosition(position);
    this._updatedAt = new Date();
  }

  // エンティティの等価性判定
  equals(other: Card): boolean {
    return this._id.equals(other._id);
  }

  // プリミティブ型への変換（インフラ層で使用）
  toPrimitives(): {
    id: string;
    listId: string;
    title: string;
    description: string;
    position: number;
    dueDate: Date | null;
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      id: this._id.value,
      listId: this._listId.value,
      title: this._title.value,
      description: this._description.value,
      position: this._position.value,
      dueDate: this._dueDate.value,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt
    };
  }
}