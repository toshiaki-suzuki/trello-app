export class CardTitle {
  private readonly _value: string;

  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('カードタイトルは必須です');
    }
    if (value.length > 200) {
      throw new Error('カードタイトルは200文字以内で入力してください');
    }
    this._value = value.trim();
  }

  get value(): string {
    return this._value;
  }

  equals(other: CardTitle): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}