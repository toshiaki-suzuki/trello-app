export class ListId {
  private readonly _value: string;

  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('ListIdは空にできません');
    }
    this._value = value;
  }

  get value(): string {
    return this._value;
  }

  equals(other: ListId): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }

  static generate(): ListId {
    return new ListId(Date.now().toString() + Math.random().toString(36).substr(2, 9));
  }
}