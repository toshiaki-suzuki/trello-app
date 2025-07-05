export class BoardId {
  private readonly _value: string;

  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('BoardIdは空にできません');
    }
    this._value = value;
  }

  get value(): string {
    return this._value;
  }

  equals(other: BoardId): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }

  static generate(): BoardId {
    return new BoardId(Date.now().toString());
  }
}