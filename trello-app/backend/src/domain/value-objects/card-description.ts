export class CardDescription {
  private readonly _value: string;

  constructor(value?: string) {
    if (value && value.length > 2000) {
      throw new Error('カード説明は2000文字以内で入力してください');
    }
    this._value = value?.trim() || '';
  }

  get value(): string {
    return this._value;
  }

  get isEmpty(): boolean {
    return this._value.length === 0;
  }

  equals(other: CardDescription): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}