export function calculateValue (pickOption, value) {
  if (pickOption === 'multiply') {
    return value * 1.60934
  }
  if (pickOption === 'divide') {
    return value / 1.60934
  }
}
