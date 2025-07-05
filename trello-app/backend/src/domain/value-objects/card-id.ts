export class CardId {
  private readonly _value: string;

  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('CardIdは空にできません');
    }
    this._value = value;
  }

  get value(): string {
    return this._value;
  }

  equals(other: CardId): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }

  static generate(): CardId {
    return new CardId(Date.now().toString() + Math.random().toString(36).substr(2, 9));
  }
}