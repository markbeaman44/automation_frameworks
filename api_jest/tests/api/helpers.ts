import { pickOption } from './types/interface';

export function calculateValue(pickOption: pickOption, value: number): number {
  if (pickOption === 'multiply') {
    return value * 1.60934;
  }
  if (pickOption === 'divide') {
    return value / 1.60934;
  }
}
