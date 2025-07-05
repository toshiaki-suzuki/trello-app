export class CardPosition {
  private readonly _value: number;

  constructor(value: number) {
    if (value < 0) {
      throw new Error('カードポジションは0以上である必要があります');
    }
    this._value = value;
  }

  get value(): number {
    return this._value;
  }

  equals(other: CardPosition): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value.toString();
  }

  static zero(): CardPosition {
    return new CardPosition(0);
  }

  next(): CardPosition {
    return new CardPosition(this._value + 1);
  }

  previous(): CardPosition {
    return new CardPosition(Math.max(0, this._value - 1));
  }
}