export class BoardDescription {
  private readonly _value: string;

  constructor(value?: string) {
    if (value && value.length > 500) {
      throw new Error('ボード説明は500文字以内で入力してください');
    }
    this._value = value?.trim() || '';
  }

  get value(): string {
    return this._value;
  }

  get isEmpty(): boolean {
    return this._value.length === 0;
  }

  equals(other: BoardDescription): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}