export class CardDueDate {
  private readonly _value: Date | null;

  constructor(value?: Date) {
    this._value = value || null;
  }

  get value(): Date | null {
    return this._value;
  }

  get hasValue(): boolean {
    return this._value !== null;
  }

  get isOverdue(): boolean {
    if (!this._value) return false;
    return this._value < new Date();
  }

  equals(other: CardDueDate): boolean {
    if (!this._value && !other._value) return true;
    if (!this._value || !other._value) return false;
    return this._value.getTime() === other._value.getTime();
  }

  toString(): string {
    return this._value ? this._value.toISOString() : '';
  }

  static none(): CardDueDate {
    return new CardDueDate();
  }
}