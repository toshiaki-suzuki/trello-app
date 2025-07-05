export class BoardBackgroundColor {
  private readonly _value: string;
  private static readonly DEFAULT_COLOR = '#0079bf';
  private static readonly VALID_PATTERN = /^#[0-9A-Fa-f]{6}$/;

  constructor(value?: string) {
    const color = value || BoardBackgroundColor.DEFAULT_COLOR;
    
    if (!BoardBackgroundColor.VALID_PATTERN.test(color)) {
      throw new Error('背景色は有効なHEXカラーコード（例: #0079bf）で指定してください');
    }
    
    this._value = color;
  }

  get value(): string {
    return this._value;
  }

  equals(other: BoardBackgroundColor): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }

  static default(): BoardBackgroundColor {
    return new BoardBackgroundColor();
  }
}