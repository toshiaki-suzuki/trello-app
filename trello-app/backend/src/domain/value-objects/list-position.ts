export class ListPosition {
  private readonly _value: number;

  constructor(value: number) {
    if (value < 0) {
      throw new Error('リストポジションは0以上である必要があります');
    }
    this._value = value;
  }

  get value(): number {
    return this._value;
  }

  equals(other: ListPosition): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value.toString();
  }

  static zero(): ListPosition {
    return new ListPosition(0);
  }

  next(): ListPosition {
    return new ListPosition(this._value + 1);
  }

  previous(): ListPosition {
    return new ListPosition(Math.max(0, this._value - 1));
  }
}