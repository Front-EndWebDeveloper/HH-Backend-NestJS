export class NumberHelper {
  static clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  static random(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static round(value: number, decimals: number = 2): number {
    return Number(value.toFixed(decimals));
  }
}

