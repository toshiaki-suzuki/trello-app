export class BoardTitle {
  private readonly _value: string;

  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('ボードタイトルは必須です');
    }
    if (value.trim().length > 100) {
      throw new Error('ボードタイトルは100文字以内で入力してください');
    }
    this._value = value.trim();
  }

  get value(): string {
    return this._value;
  }

  equals(other: BoardTitle): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}